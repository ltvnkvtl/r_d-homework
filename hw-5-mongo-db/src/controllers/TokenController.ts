import { Request, Response } from 'express';
import Token from '../models/token';
import User from '../models/user';

const jwt = require('jsonwebtoken');

class TokenController {
    async create(req: Request, res: Response) {
        try {
            const id = req.body._id;

            // Validate user input
            if (!id) {
                return res.status(400).send({ message: 'id не указан' });
            }

            // find user for generate token
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send({ message: 'user not found' });
            }

            const token = jwt.sign({ _id: user._id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
                expiresIn: `${Math.floor(Math.random() * 11)}h`,
            });

            // find user tokens
            const userTokens = await Token.findOne({ userId: id });

            let updatedUserTokens;
            if (!userTokens) {
                // if no user in collection - create new one
                updatedUserTokens = await Token.create({ userId: id, tokens: [token] });
            } else {
                // $addToSet don't create duplicates in array, only unique items
                updatedUserTokens = await Token.findByIdAndUpdate(
                    userTokens.id,
                    { $addToSet: { tokens: token } },
                    { new: true },
                );
            }

            return res.json(updatedUserTokens);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const userTokens = await Token.find();
            return res.json(userTokens.map(({ userId, tokens }) => ({ userId, tokens })));
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'id не указан' });
            }
            const userTokens = await Token.findOne({ userId: id });

            userTokens ? res.json(userTokens.tokens) : res.status(404).send({ message: 'User tokens not found' });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async updateOne(req: Request, res: Response) {
        try {
            const id = req.body._id;
            if (!id) {
                return res.status(400).json({ message: 'id не указан' });
            }
            // удаляем первый токен (самый старый)
            // @ts-ignore
            await Token.updateOne({ userId: id }, { $pop: { tokens: -1 } });

            // получаем юзера для формирования нового токена
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send({ message: 'user not found' });
            }

            const token = jwt.sign({ _id: user._id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
                expiresIn: `${Math.floor(Math.random() * 11)}h`,
            });

            let updatedUserTokens = await Token.findOneAndUpdate(
                { userId: id },
                { $addToSet: { tokens: token } },
                { new: true },
            );

            return res.json(updatedUserTokens);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteUserTokens(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: 'id не указан' });
            }

            await Token.updateOne({ userId: id }, { $set: { tokens: [] } }, { new: true });

            return res.json({ userId: id, tokens: [] });
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

export default new TokenController();
