import express from 'express';

import UserController from '../controllers/UserController';
import { param } from "express-validator";
import { authMiddleWare } from "../middleware/auth-middleware";

const userRouter = express.Router();

userRouter.get('/users', authMiddleWare, UserController.getAllUsers);
userRouter.get('/users/:id',
  authMiddleWare,
  param('id').isMongoId(),
  UserController.getUserById);
userRouter.put('/users', UserController.updateOne);
userRouter.delete('/users/:id', UserController.deleteOne);

export default userRouter;
