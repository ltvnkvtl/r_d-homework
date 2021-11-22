import express from 'express';

import UserController from '../controllers/UserController';
import { verifyToken } from '../middleware/verifyToken';
import {body} from "express-validator";
import { isUserRole } from "../helper-functions/helper-functions";

const userRouter = express.Router();

userRouter.get('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 16 }),
  body('name').optional().isString(),
  body('role').optional().custom(isUserRole).withMessage('role must be "admin" or "user"'),
  UserController.registration);
userRouter.get('/login', UserController.login);
userRouter.get('/logout', UserController.logout);
userRouter.get('/refresh', UserController.refresh);

userRouter.get('/users', UserController.getAll);
userRouter.get('/users/:id', UserController.getOne);
userRouter.post('/users', UserController.create);
userRouter.put('/users', UserController.updateOne);
userRouter.delete('/users/:id', verifyToken, UserController.deleteOne);

export default userRouter;
