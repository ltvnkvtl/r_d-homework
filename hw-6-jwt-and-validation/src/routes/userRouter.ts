import express from 'express';

import UserController from '../controllers/UserController';
import {body, param} from "express-validator";
import { isUserRole } from "../helper-functions/helper-functions";
import { authMiddleWare } from "../middleware/auth-middleware";

const userRouter = express.Router();

userRouter.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 16 }),
  body('name').optional().isString(),
  body('role').optional().custom(isUserRole).withMessage('role must be "admin" or "user"'),
  UserController.registration);

userRouter.post('/login',
  body('email').isEmail().withMessage('valid email is required'),
  body('password').exists({ checkFalsy: true }).withMessage('password is required'),
  UserController.login);

userRouter.post('/logout', UserController.logout);
userRouter.get('/refresh', UserController.refresh);
userRouter.get('/users', authMiddleWare, UserController.getAllUsers);

userRouter.get('/users/:id',
  authMiddleWare,
  param('id').isMongoId(),
  UserController.getUserById);
userRouter.put('/users', UserController.updateOne);
userRouter.delete('/users/:id', UserController.deleteOne);

export default userRouter;
