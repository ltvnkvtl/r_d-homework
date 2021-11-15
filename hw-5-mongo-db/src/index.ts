import { Request, Response } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import express from 'express';

import User from './models/user';
import { verifyToken } from './middleware/verifyToken';
import * as swaggerDocument from './swagger.json';
import userRouter from "./routes/userRouter";
import tokenRouter from "./routes/tokenRouter";

const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const DB_URL = 'mongodb+srv://rd-hw-5-admin:lovegirlsnotboys@cluster0.9sspa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', userRouter);
app.use('/api', tokenRouter);
const port = 3030;

function startApp() {
  try {
    mongoose.connect(DB_URL, (err) => {
      if (err) return console.log(err);
      app.listen(port, () => console.log(`Server started on port ${port}`));
    })
  } catch (e) {
    console.log(e)
  }
}

startApp();

// // TOKENS =================================================================================
//
// // получение токенов всех пользователей
// app.get('/api/tokens', (req: Request, res: Response) => {
//     const users = getParsedJsonData().filter((user: User) => !!user.token);
//
//     if (users.length) {
//         res.send(
//             users.reduce((acc: Record<string, string>, user: User) => {
//                 // @ts-ignore
//                 acc[user.name] = user.token;
//
//                 return acc;
//             }, {}),
//         );
//     } else {
//         res.status(404).send('Every user does not have token');
//     }
// });
//
// // создание токена пользователю
// app.post('/api/tokens', (req: Request, res: Response) => {
//     if (!req.body) return res.sendStatus(400);
//
//     const userId = Number(req.body.id);
//
//     const users = getParsedJsonData();
//     const user: User | undefined = users.find((user: User) => user.id === userId);
//
//     if (user) {
//         user.token = jwt.sign({ id: user.id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
//             expiresIn: '12h',
//         });
//
//         fs.writeFileSync('src/users.json', JSON.stringify(users));
//         res.status(200).json(user);
//     } else {
//         res.status(404).send('User not found');
//     }
// });
//
// // изменение токена пользователя
// app.put('/api/tokens', (req: Request, res: Response) => {
//     if (!req.body) return res.sendStatus(400);
//
//     const userId = Number(req.body.id);
//
//     const users = getParsedJsonData();
//     const user: User | undefined = users.find((user: User) => user.id === userId);
//
//     if (user) {
//         user.token = jwt.sign({ id: user.id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
//             expiresIn: '8h',
//         });
//
//         fs.writeFileSync('src/users.json', JSON.stringify(users));
//         res.status(200).json(user);
//     } else {
//         res.status(404).send('User not found');
//     }
// });
//
// // получение токена пользователя по id
// app.get('/api/token/:id', (req: Request, res: Response) => {
//     const userId = Number(req.params.id);
//     const users = getParsedJsonData();
//
//     const user: User | undefined = users.find((user: User) => user.id === userId);
//
//     if (user) {
//         user.token ? res.send(user.token) : res.status(404).send('User does not have token');
//     } else {
//         res.status(404).send('User not found');
//     }
// });
//
// // удаление токена пользователя по id
// app.delete('/api/tokens/:id', verifyToken, (req: Request, res: Response) => {
//     if ((req as any).user.role !== 'admin') {
//         res.status(403).send('You should be an admin');
//     } else {
//         const userId = Number(req.params.id);
//         const users = getParsedJsonData();
//         const user: User | undefined = users.find((user: User) => user.id === userId);
//
//         if (user) {
//             user.token = undefined;
//             fs.writeFileSync('src/users.json', JSON.stringify(users));
//             res.send(user);
//         } else {
//             res.status(404).send('User not found');
//         }
//     }
// });
//
// function getParsedJsonData(): User[] {
//     return JSON.parse(fs.readFileSync(filePath, 'utf8'));
// }

// аутентификация для получения токена
// app.post("/api/login", async (req, res) => {
//   try {
//     const { id } = req.body;
//
//     // Validate user input
//     if (!id) {
//       res.status(400).send("id is required");
//     }
//     const users = getParsedJsonData();
//
//     let user: User | undefined = users.find((user: User) => user.id === id);
//
//     if (user) {
//       user.token = jwt.sign(
//         { id: user.id, role: user.role, name: user.name },
//         `${process.env.JWT_SECRET_KEY}`,
//         {
//           expiresIn: "12h",
//         }
//       );
//
//       fs.writeFileSync("src/users.json", JSON.stringify(users));
//       res.status(200).json(user);
//     } else {
//       res.status(400).send("Invalid Credentials");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });
