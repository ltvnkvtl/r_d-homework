import {NextFunction, Request, Response} from 'express';
import UserService from '../services/UserService';
import User from '../models/user';
import {validationResult} from "express-validator";
import ApiError from "../exceptions/ApiErrors";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }

      const userData = await UserService.registration(req.body);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }

      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');

      res.json({ message: 'Success' });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

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

  async updateOne(req: Request, res: Response) {
    try {
      const user = req.body;
      if (!user._id) {
        return res.status(400).json({message: 'id не указан'});
      }
      if (user.token) {
        return res.status(400).json({message: 'use /api/tokens endpoint to update token'});
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true});

      return res.json(updatedUser);
    } catch (e) {
      res.status(500).json(e);
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
