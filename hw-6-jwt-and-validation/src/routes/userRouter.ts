import express from 'express';

import UserController from '../controllers/UserController';
import { verifyToken } from '../middleware/verifyToken';

const userRouter = express.Router();

userRouter.get('/users', UserController.getAll);
userRouter.get('/users/:id', UserController.getOne);
userRouter.post('/users', UserController.create);
userRouter.put('/users', UserController.updateOne);
userRouter.delete('/users/:id', verifyToken, UserController.deleteOne);

export default userRouter;
