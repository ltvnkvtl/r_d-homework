import {NextFunction, Request, Response} from 'express';
import UserService from '../services/UserService';
import User from '../models/user';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;
      const userData = await UserService.registration(req.body);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      console.log(e)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {

    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {

    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {

    }
  }

  async create(req: Request, res: Response) {
    try {
      if (!req.body) return res.status(400).send('empty body');

      const {name, role} = req.body;

      // Validate user input
      if (!name) {
        res.status(400).send('name is required');
      }

      const user = await User.create({name, role: role || 'user'});
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find();

      return res.json(users);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const {id} = req.params;
      if (!id) {
        return res.status(400).json({message: 'id не указан'});
      }
      const user = await User.findById(id);

      user ? res.status(200).json(user) : res.status(404).send({message: 'User not found'});
    } catch (e) {
      res.status(500).json(e);
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
