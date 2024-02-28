import multer from 'multer'
import sharp from 'sharp'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../errors/appError.js'
import { exec } from '../db.js'

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Only images are allowed.'), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

export const uploadUserPhoto = upload.single('photo')

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  const { file } = req
  if (!file) return next()

  file.filename = `user-${req.user.id}.jpg`

  await sharp(file.buffer)
    .resize(500, 500)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${file.filename}`)

  next()
})

export const updateCurrentUser = catchAsync(async (req, res) => {
  const { firstName, lastName } = req.body
  const { file } = req
  const fileName = file?.filename ? file.filename : null

  await exec('UPDATE user SET first_name = ?, last_name = ?, photo = ? WHERE id = ?', [firstName, lastName, fileName, req.user.id])
  const user = (await exec('SELECT * FROM user WHERE id = ?', [req.user.id]))[0]

  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

export const getCurrentUser = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  })
})

export const deleteCurrentUser = catchAsync(async (req, res, next) => {
  const { changes } = await exec('UPDATE user SET is_active = 0 WHERE id = ?', [req.user.id])

  if (changes) {
    res.clearCookie('jwt')
    res.status(200).json({
      status: 'success',
      data: null
    })
  } else {
    next(new AppError('Unable to log out. Please try again later.', 500))
  }
})

export const getCurrentTaskHistory = catchAsync(async (req, res) => {
  const tasks = await exec('SELECT * FROM task WHERE id IN (SELECT task_id FROM task_user WHERE user_id = ?)', [req.user.id])

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].user = (await exec('SELECT * FROM user WHERE id = ?', [tasks[i].user_id]))[0]
  }
  
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  })
})

export const getPendingReviews = catchAsync(async (req, res) => {
  const ownerTasks = (await exec('SELECT id FROM task WHERE user_id = ? AND status_id = 4;', [req.user.id])).map(it => it.id)

  const reviews = []
  for (let taskId of ownerTasks) {
    const userIds = (await exec('SELECT user_id FROM task_user WHERE task_id = ? AND rating IS NULL AND COALESCE(valid_until, strftime(\'%s\', \'now\') * 1001) > strftime(\'%s\', \'now\') * 1000;', [taskId])).map(it => it.user_id)

    for (let userId of userIds) {
      reviews.push({
        taskId,
        user: (await exec('SELECT * FROM user WHERE id = ?', [userId]))[0]
      })
    }
  }

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  })
})
