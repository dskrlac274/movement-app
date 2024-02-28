import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../errors/appError.js'
import { exec } from '../db.js'

export const getOne = (resource) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params

    const document = (await exec(`SELECT * FROM ${resource} WHERE id = ?`, [id]))[0]

    if (!document) {
      return next(new AppError(`No ${resource} found with id '${id}'.`, 404))
    }

    res.status(200).json({
      status: 'success',
      data: { [`${resource}`]: document }
    })
  })

export const getAll = (resource) =>
  catchAsync(async (req, res) => {

    const documents = await exec(`SELECT * FROM ${resource}`)

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: { [`${resource + "s"}`]: documents }
    })
  })
