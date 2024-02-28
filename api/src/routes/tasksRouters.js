import express from 'express'
import * as tasksController from '../controllers/tasksController.js'
import * as authController from '../controllers/authController.js'

const router = express.Router()

router.use(authController.authenticate)

router.get('/within/:distance/center/:latlng', tasksController.getTasksWithin)

router.route('/')
  .get(tasksController.getAllTasks)
  .post(tasksController.createTask)

router.route('/:id')
  .get(tasksController.getTask)
  .patch(tasksController.updateTask)
  .delete(tasksController.deleteTask)

router.route('/:taskId')
  .post(tasksController.addUserToTask)

router.route('/:taskId/users/:userId/ratings/:rating')
  .post(tasksController.rateUser)

export default router
