import {Request, Response} from "express";
import Token from "../models/token";
import User from "../models/user";

const jwt = require('jsonwebtoken');

class TokenController {
  async create(req: Request, res: Response) {
    try {
      console.log('here')
      const id = req.body._id;

      // Validate user input
      if (!id) {
        res.status(400).send({ message: 'id не указан' });
      }

      const user = await User.findById(id);
      console.log(user);
      const mongooseTokenMap = await Token.findOne({});
      const tokenMap = mongooseTokenMap.tokenMap;
      const token = jwt.sign({ _id: user._id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
            expiresIn: '11h',
        });
      if (tokenMap[id]) {
        tokenMap.get(id)
      }
      tokenMap.set(id, token);
      mongooseTokenMap.save();
      res.status(200).json(mongooseTokenMap);
    } catch (e) {
      console.log(e)
      res.status(500).json(e);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.json(users);
    }
    catch (e) {
      res.status(500).json(e);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'id не указан'});
      }
      const user = await User.findById(id);

      user ? res.status(200).json(user) : res.status(404).send({ message: 'User not found'});
    }
    catch (e) {
      res.status(500).json(e);
    }
  }

  async updateOne(req: Request, res: Response) {
    try {
      const user = req.body
      if (!user._id) {
        return res.status(400).json({ message: 'id не указан' })
      }
      if (user.token) {
        return res.status(400).json({ message: 'use /api/tokens endpoint to update token' })
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })

      return res.json(updatedUser);
    }
    catch (e) {
      res.status(500).json(e);
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const id = req.body._id;
      if (!id) {
        return res.status(400).json({ message: 'id не указан' })
      }
      const deletedUser = await User.findByIdAndDelete(id);

      return res.json(deletedUser);
    }
    catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new TokenController();
