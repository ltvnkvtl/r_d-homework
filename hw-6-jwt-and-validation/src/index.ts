import mongoose from 'mongoose';
import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { serve, setup } from 'swagger-ui-express';

import * as swaggerDocument from './swagger.json';
import userRouter from './routes/userRouter';
import { errorMiddleware } from "./middleware/error-middleware";

config(); // .env

const port = process.env.PORT || 3030;

const app = express();
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', serve, setup(swaggerDocument));
app.use('/api', userRouter);
app.use(errorMiddleware)


function startApp(): void {
    try {
        mongoose.connect(`${process.env.DB_URL}`, (err) => {
            if (err) return console.log(err);
            app.listen(port, () => console.log(`Server started on port ${port}`));
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();
