import {NextFunction, Request, Response} from 'express';
import UserService from '../services/UserService';
import User from '../models/user';
import {validationResult} from "express-validator";
import ApiError from "../exceptions/ApiErrors";

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }

      const user = await UserService.getUserById(req.params.id);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }

      let user = req.body;

      const updatedUser = await UserService.updateUser(user);

      return res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = (req as any).user.role;
      if (role !== 'admin') {
        return res.status(403).json({message: 'You should be an admin'});
      }
      if (!id) {
        return res.status(400).json({message: 'id не указан'});
      }
      const deletedUser = await User.findByIdAndDelete(id);

      return res.json(deletedUser);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new UserController();
