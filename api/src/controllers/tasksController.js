import { exec } from '../db.js'
import { AppError } from '../errors/appError.js'
import { catchAsync } from '../utils/catchAsync.js'

export const getAllTasks = catchAsync(async (req, res, next) => {
  let startDate
  let endDate

  if (req.query.startDate) {
    startDate = getYearDateEntry(new Date(req.query.startDate))
    if (startDate == null)
      return next(new AppError('Invalid date.'))
  }

  if (req.query.endDate) {
    endDate = getYearDateEntry(new Date(req.query.endDate))
    console.log(endDate)
    if (endDate == null)
      return next(new AppError('Invalid date.'))
  }

  let documents

  if (startDate && !endDate) {
    documents = await exec('SELECT * FROM task WHERE ? >= strftime(\'%Y-%m-%d\', start_date)', [startDate])
  } else if (!startDate && endDate) {
    documents = await exec('SELECT * FROM task WHERE ? <= strftime(\'%Y-%m-%d\', end_date)', [endDate])
  } else if (startDate && endDate) {
    documents = await exec('SELECT * FROM task WHERE strftime(\'%Y-%m-%d\', start_date) >= ? AND strftime(\'%Y-%m-%d\', end_date) <= ?;', [startDate, endDate])
  } else {
    documents = await exec(`SELECT * FROM task`)
  }

  for (let i = 0; i < documents.length; i++) {
    documents[i].user = (await exec('SELECT * FROM user WHERE id = ?', [documents[i].user_id]))[0]
  }

  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: {
      tasks: documents
    }
  })
})


function isValidDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
}

function getYearDateEntry(date) {
  if (!isValidDate(date)) {
    return null
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-based
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getTask = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const document = (await exec(`SELECT * FROM task WHERE id = ?`, [id]))[0]

  if (!document) {
    return next(new AppError(`No task found with id '${id}'.`, 404))
  }

  document.user = (await exec('SELECT * FROM user WHERE id = ?', [document.user_id]))[0]

  res.status(200).json({
    status: 'success',
    data: { task: document }
  })
})


export const createTask = catchAsync(async (req, res, next) => {
  const task = extractTaskFromReq(req)

  if (!task.statusId || !task.difficultyId || !task.name ||
    !task.reward || !task.description || !task.groupSize ||
    !task.lat || !task.lng || !task.startDate || !task.endDate) {
    return next(new AppError('Missing task info.', 422))
  }

  const { lastID } = await exec('INSERT INTO task(name, reward, description, group_size, lat, lng, start_date, end_date, is_activity, status_id, difficulty_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [task.name, task.reward, task.description, task.groupSize, task.lat, task.lng, task.startDate, task.endDate, task.isActivity, task.statusId, task.difficultyId, req.user.id])
  const newTask = (await exec('SELECT * FROM task WHERE id = ?;', [lastID]))[0]

  res.status(201).json({
    status: 'success',
    data: { task: newTask }
  })
})

export const addUserToTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params
  const userId = req.user.id

  const fetchedTask = (await exec('SELECT * FROM task WHERE id = ?', [taskId]))[0]
  const userTasks = await exec('SELECT * FROM task_user WHERE task_id = ?', [taskId])

  if (!fetchedTask) {
    return next(new AppError('Task doesn\'t exist.', 404))
  }

  if (!taskId || !userId) {
    return next(new AppError('Insufficient parameters.', 422))
  }

  if (userId == fetchedTask.user_id) {
    return next(new AppError('User who added task can\'t work in it.'))
  }

  if (userTasks.map(el => el.user_id.toString()).includes(userId)) {
    return next(new AppError('User already added.'))
  }

  if (userTasks.length < fetchedTask.group_size) {
    await exec('INSERT INTO task_user(user_id, task_id) VALUES (?, ?)', [userId, taskId])
    userTasks.length++

    if (userTasks.length == fetchedTask.group_size)
      await exec('UPDATE task SET status_id = ? WHERE id = ?', [2, taskId])
  }

  if (userTasks.length - fetchedTask.group_size == 0) {
    return next(new AppError('List of users for this task is full.'))
  }

  res.status(200).json({
    status: 'success'
  })
})

export const updateTask = catchAsync(async (req, res) => {
  const task = extractTaskFromReq(req)

  const query = `UPDATE task 
  SET 
    difficulty_id = COALESCE(?, difficulty_id),
    name = COALESCE(?, name),
    reward = COALESCE(?, reward),
    description = COALESCE(?, description),
    lat = COALESCE(?, lat),
    lng = COALESCE(?, lng),
    start_date = COALESCE(?, start_date),
    end_date = COALESCE(?, end_date)
  WHERE id = ?`

  const { lastID } = await exec(query, [task.difficultyId, task.name, task.reward, task.description, task.lat, task.lng, task.startDate, task.endDate, task.id])
  const updatedTask = (await exec('SELECT * FROM task WHERE id = ?', [lastID]))[0]

  res.status(200).json({
    status: 'success',
    data: { task: updatedTask }
  })
})

export const deleteTask = async (req, res, next) => {
  const { id } = req.params

  const fetchedTask = await exec('SELECT * FROM task WHERE id = ?', [id])

  if (fetchedTask.length === 0) {
    return next(new AppError('Task doesn\'t exist.', 404))
  }

  await exec('DELETE FROM task WHERE id = ?', [id])

  res.status(200).json({
    status: 'success',
    data: { task: fetchedTask }
  })
}

export const getTasksWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng } = req.params
  const [lat, lng] = latlng.split(',')

  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude in the lat,lng format.'))
  }

  const radius = 6378.1 // Earth radius in kilometers (use 3959 for miles)
  const latRad = lat * (Math.PI / 180)
  const lngRad = lng * (Math.PI / 180)

  const query = `SELECT *, id, name, lat, lng, (
      ${radius} * acos(
        cos(${latRad}) *
        cos(lat * (PI() / 180)) *
        cos(lng * (PI() / 180) - ${lngRad}) +
        sin(${latRad}) *
        sin(lat * (PI() / 180))
      )
    ) AS distance
    FROM task
    WHERE (
      ${radius} * acos(
        cos(${latRad}) *
        cos(lat * (PI() / 180)) *
        cos(lng * (PI() / 180) - ${lngRad}) +
        sin(${latRad}) *
        sin(lat * (PI() / 180))
      )
    ) <= ${distance}
  `

  console.info({ query })
  const tasks = await exec(query, [])

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].user = (await exec('SELECT * FROM user WHERE id = ?', [tasks[i].user_id]))[0]
  }

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  })
})

export const rateUser = catchAsync(async (req, res, next) => {
  const { taskId, userId, rating } = req.params

  const doc = (await exec('SELECT * FROM task_user WHERE task_id = ? AND user_id = ? AND rating IS NULL;', [taskId, userId]))[0]

  if (!doc) {
    return next(new AppError('Cannot set rating for a given task and user.'))
  }

  if (req.user.id == userId) {
    return next(new AppError('Cannot set your own rating.'))
  }

  await exec('UPDATE task_user SET rating = ? WHERE user_id = ? AND task_id = ?', [rating, userId, taskId])

  if (rating > 0) {
    await exec(`UPDATE user SET 
      ratings_average = ((ratings_average * ratings_quantity) + ?) / (ratings_quantity + 1),
      ratings_quantity = ratings_quantity + 1
      WHERE id = ?;`, [rating, userId])
  }

  const user = await exec('SELECT * FROM user WHERE id = ?', [userId])

  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

const extractTaskFromReq = (req) => {
  const { id } = req.params
  const {
    statusId,
    difficultyId,
    name,
    reward,
    description,
    groupSize,
    lat,
    lng,
    startDate,
    endDate,
    isActivity
  } = req.body

  const task = {
    id,
    statusId,
    difficultyId,
    name,
    reward,
    description,
    groupSize,
    lat,
    lng,
    startDate,
    endDate,
    isActivity
  }
  task.isActivity = isActivity == null ? 1 : isActivity

  return task
}
