import { NextFunction, Response } from 'express';

const jwt = require('jsonwebtoken');

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        req.user = jwt.verify(token, `${process.env.TOKEN_KEY}`);
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }

    return next();
};
