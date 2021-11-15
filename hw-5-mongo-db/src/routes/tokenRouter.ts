import express from "express";
import TokenController from "../controllers/TokenController";
import { verifyToken } from '../middleware/verifyToken';

const tokenRouter = express.Router();

tokenRouter.get('/tokens', TokenController.getAll)
tokenRouter.get('/tokens/:id', TokenController.getOne)
tokenRouter.post('/tokens', TokenController.create)
tokenRouter.put('/tokens', TokenController.updateOne)
tokenRouter.delete('/tokens/:id', verifyToken, TokenController.deleteOne)

export default tokenRouter;
