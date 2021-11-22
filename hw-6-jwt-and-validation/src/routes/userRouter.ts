import express from 'express';

import UserController from '../controllers/UserController';
import { verifyToken } from '../middleware/verifyToken';

const userRouter = express.Router();

userRouter.get('/registration', UserController.registration);
userRouter.get('/login', UserController.login);
userRouter.get('/logout', UserController.logout);
userRouter.get('/refresh', UserController.refresh);

userRouter.get('/users', UserController.getAll);
userRouter.get('/users/:id', UserController.getOne);
userRouter.post('/users', UserController.create);
userRouter.put('/users', UserController.updateOne);
userRouter.delete('/users/:id', verifyToken, UserController.deleteOne);

export default userRouter;
