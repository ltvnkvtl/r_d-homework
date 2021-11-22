import mongoose from 'mongoose';
import express from 'express';

import * as swaggerDocument from './swagger.json';
import userRouter from './routes/userRouter';
import {errorHandler} from "./middleware/error-middleware";

const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');
const DB_URL = `mongodb+srv://rd-hw-5-admin:${process.env.MONGO_PASSWORD}@cluster0.9sspa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(DB_URL)
const app = express();
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', userRouter);
app.use(errorHandler)

const port = 3030;

function startApp(): void {
    try {
        mongoose.connect(DB_URL, (err) => {
            if (err) return console.log(err);
            app.listen(port, () => console.log(`Server started on port ${port}`));
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();
