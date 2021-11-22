import express from 'express';

import UserController from '../controllers/UserController';
import {body} from "express-validator";
import { isUserRole } from "../helper-functions/helper-functions";
import { authMiddleWare } from "../middleware/auth-middleware";

const userRouter = express.Router();

userRouter.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 16 }),
  body('name').optional().isString(),
  body('role').optional().custom(isUserRole).withMessage('role must be "admin" or "user"'),
  UserController.registration);
userRouter.post('/login', UserController.login);
userRouter.post('/logout', UserController.logout);
userRouter.get('/refresh', UserController.refresh);
userRouter.get('/users', authMiddleWare, UserController.getAllUsers);

userRouter.get('/users/:id', UserController.getOne);
userRouter.post('/users', UserController.create);
userRouter.put('/users', UserController.updateOne);
userRouter.delete('/users/:id', UserController.deleteOne);

export default userRouter;
