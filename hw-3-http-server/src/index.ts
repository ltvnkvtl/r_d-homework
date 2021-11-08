import { Request, Response } from 'express';
import fs from 'fs';

import { User } from './models/user';
import { verifyToken } from './middleware/verifyToken';

const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

const filePath = 'src/users.json';
const port = 3030;

// USERS =================================================================================

// получение всех пользователей
app.get('/api/users', (req: Request, res: Response) => {
    const users = getParsedJsonData();
    res.send(users);
});

// получение одного пользователя по id
app.get('/api/users/:id', (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const users = getParsedJsonData();

    const user: User | undefined = users.find((user: User) => user.id === userId);
    user ? res.send(user) : res.status(404).send('User not found');
});

// создание пользователя
app.post('/api/users', (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const userName = req.body.name;
    const userRole = req.body.role || 'user';

    // Validate user input
    if (!userName) {
        res.status(400).send('name is required');
    }

    const user: User = { name: userName, role: userRole, id: 0 };

    const users = getParsedJsonData();

    const id = Math.max.apply(
        Math,
        users.map((user: User) => user.id!),
    );
    user.id = id + 1;
    users.push(user);
    fs.writeFileSync('src/users.json', JSON.stringify(users));

    res.send(user);
});

// изменение имени и роли пользователя
app.put('/api/users', (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const userId = Number(req.body.id);

    const users = getParsedJsonData();
    const user: User | undefined = users.find((user: User) => user.id === userId);

    if (user) {
        req.body.name && (user.name = req.body.name);
        req.body.role && (user.role = req.body.role);
        fs.writeFileSync('src/users.json', JSON.stringify(users));
        res.send(user);
    } else {
        res.status(404).send(user);
    }
});

// удаление пользователя по id
app.delete('/api/users/:id', verifyToken, (req: Request, res: Response) => {
    if ((req as any).user.role !== 'admin') {
        res.status(403).send('You should be an admin');
    } else {
        const userId = Number(req.params.id);
        const users = getParsedJsonData();
        const index = users.findIndex((user: User) => user.id === userId);

        if (index > -1) {
            const user = users.splice(index, 1)[0];
            fs.writeFileSync('src/users.json', JSON.stringify(users));
            res.send(user);
        } else {
            res.status(404).send('User not found');
        }
    }
});

// TOKENS =================================================================================

// получение токена пользователя по id
app.get('/api/token/:id', (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const users = getParsedJsonData();

    const user: User | undefined = users.find((user: User) => user.id === userId);

    if (user) {
        user.token ? res.send(user.token) : res.status(404).send('User does not have token');
    } else {
        res.status(404).send('User not found');
    }
});

// получение токенов всех пользователей
app.get('/api/tokens', (req: Request, res: Response) => {
    const users = getParsedJsonData().filter((user: User) => !!user.token);

    if (users.length) {
        res.send(
            users.reduce((acc: Record<string, string>, user: User) => {
                // @ts-ignore
                acc[user.name] = user.token;

                return acc;
            },           { }),
        );
    } else {
        res.status(404).send('Every user does not have token');
    }
});

// создание токена пользователю
app.post('/api/token', (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const userId = Number(req.body.id);

    const users = getParsedJsonData();
    const user: User | undefined = users.find((user: User) => user.id === userId);

    if (user) {
        user.token = jwt.sign({ id: user.id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
            expiresIn: '12h',
        });

        fs.writeFileSync('src/users.json', JSON.stringify(users));
        res.status(200).json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// изменение токена пользователя
app.put('/api/token', (req: Request, res: Response) => {
    if (!req.body) return res.sendStatus(400);

    const userId = Number(req.body.id);

    const users = getParsedJsonData();
    const user: User | undefined = users.find((user: User) => user.id === userId);

    if (user) {
        user.token = jwt.sign({ id: user.id, role: user.role, name: user.name }, `${process.env.TOKEN_KEY}`, {
            expiresIn: '8h',
        });

        fs.writeFileSync('src/users.json', JSON.stringify(users));
        res.status(200).json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// удаление токена пользователя по id
app.delete('/api/token/:id', verifyToken, (req: Request, res: Response) => {
    if ((req as any).user.role !== 'admin') {
        res.status(403).send('You should be an admin');
    } else {
        const userId = Number(req.params.id);
        const users = getParsedJsonData();
        const user: User | undefined = users.find((user: User) => user.id === userId);

        if (user) {
            user.token = undefined;
            fs.writeFileSync('src/users.json', JSON.stringify(users));
            res.send(user);
        } else {
            res.status(404).send('User not found');
        }
    }
});

app.listen(port, () => {
    console.log('Сервер ожидает подключения...');
});

function getParsedJsonData(): User[] {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

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
