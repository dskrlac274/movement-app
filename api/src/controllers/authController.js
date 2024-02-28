import ms from 'ms'
import jwt from 'jsonwebtoken'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../errors/appError.js'
import { Email } from '../utils/email.js'
import { compare, encrypt } from '../utils/bcryptWrapper.js'
import { exec } from '../db.js'

const signJwt = ({ email }) => new Promise((resolve, reject) => {
  jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT,
    issuer: process.env.JWT_ISSUER
  }, (err, token) => err ? reject(err) : resolve(token))
})

const verifyJwt = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER
  }, (err, decoded) => err ? reject(err) : resolve(decoded))
})

const createSendJwt = async (user, req, res, statusCode = 200) => {
  const token = await signJwt(user)

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + ms(process.env.JWT_TIMEOUT)),
    secure: req.secure,
    httpOnly: true
  })

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  })
}

export const signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords not matching.', 404))
  }

  const usersWithExistingEmail = await exec('SELECT * FROM user WHERE email = ?', [email])
  if (usersWithExistingEmail.length === 1) {
    return next(new AppError('User with the same email already exists.', 404))
  }

  const hashedPassword = await encrypt(password)

  const { lastID } = await exec('INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?);', [firstName, lastName, email, hashedPassword])
  const users = await exec('SELECT * FROM user WHERE id = ?', [lastID])
  const user = users[0]

  await new Email(user, `${req.protocol}://${req.get('host')}/me`).sendWelcome()

  await createSendJwt(user, req, res, 201)
})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password.'))
  }

  const user = (await exec('SELECT * FROM user WHERE email = ?', [email]))[0]

  if (user.is_active == 0) {
    return next(new AppError('Account deactivated.'))
  }

  if (!user || !(await compare(password, user.password))) {
    return next(new AppError(`Incorrect email or password.`, 401))
  }

  await createSendJwt(user, req, res)
})

export const logout = (req, res) => {
  res.clearCookie('jwt')
  res.status(200).json({
    status: 'success',
    data: null
  })
}

export const authenticate = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers

  if (authorization && authorization.startsWith('Bearer')) {
    const token = authorization.split(' ')[1]

    if (token) {
      return await authenticateToken(token, req, next)
    }
  } else if (req.cookies.jwt) {
    return await authenticateToken(req.cookies.jwt, req, next)
  }

  next(new AppError('Unauthorized access.', 401))
})

const authenticateToken = async (token, req, next) => {
  const decoded = await verifyJwt(token)
  const email = decoded.email

  req.user = (await exec('SELECT * FROM user WHERE email = ?', [email]))[0]
  next()
}
