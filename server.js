const express = require('express');
const uuid = require('uuid');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/mydb';
const option = { useNewUrlParser: true, useUnifiedTopology: true };

const app = express();
app.use(cors());
app.use(express.json());

const toDoBoard = [
    {
        idList: uuid(),
        title: 'My to do list',
        tasks: [
            {
                id: uuid(),
                name: 'Co',
                selected: true,
            },
            {
                id: uuid(),
                name: 'Destroy half of the universe',
                selected: false,
            },
        ],
    },
];

const dbConnect = async () => {
    const connect = await MongoClient.connect(url, option);
    return connect;
};

app.get('/list', (_, res) => {
    // if (!dbConnect()) {
        return res.json(toDoBoard);
    // }
    return res.sendStatus(404);
});

app.get('/list/:id', (req, res) => {
    const list = toDoBoard.find(l => l.idList === req.params.id);
    if (!list) {
        res.sendStatus(404);
    }
    res.json(list);
});

app.post('/list', (req, res) => {
    console.log(req.body);
    if (
        typeof req.body.title !== 'string'
    || !Array.isArray(req.body.tasks)
    || req.body.tasks.some(
        item => typeof item.id !== 'string'
        || typeof item.name !== 'string'
        || typeof item.selected !== 'boolean',
    )
    ) {
        res.sendStatus(400);
    } else {
        const newList = {
            idList: uuid(),
            title: req.body.title,
            tasks: req.body.tasks.map(item => ({
                id: uuid(),
                name: item.name,
                selected: item.selected,
            })),
        };
        toDoBoard.push(newList);
        res.json(newList);
    }
});

app.put('/list/:id', (req, res) => {
    if (
        typeof req.body.title !== 'string'
    || !Array.isArray(req.body.tasks)
    || req.body.tasks.some(
        item => typeof item.id !== 'string'
        || typeof item.name !== 'string'
        || typeof item.selected !== 'boolean',
    )
    ) {
        res.sendStatus(400);
    } else {
        const listIndex = toDoBoard.findIndex(list => list.idList === req.params.id);
        if (listIndex === -1) {
            res.sendStatus(404);
        } else {
            const list = toDoBoard[listIndex];
            toDoBoard[listIndex].title = req.body.title;
            toDoBoard[listIndex].tasks = req.body.tasks;
            res.sendStatus(200);
        }
    }
});

app.delete('/list/:id', (req, res) => {
    const listIndex = toDoBoard.findIndex(list => list.idList === req.params.id);
    if (listIndex === -1) {
        res.sendStatus(404);
    } else {
        toDoBoard.splice(listIndex, 1);
        res.sendStatus(200);
    }
});

const port = 3001;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
