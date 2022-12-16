const express = require('express');
const { createMeeting,
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    deleteAllFromDatabase } = require('./db.js'); 
const apiRouter = express.Router();
const morgan = require('morgan');

apiRouter.use(morgan('dev'));

apiRouter.param('minionId', (req, res, next, minionId) => {
    if (isNaN(Number(minionId))) {
        console.log(`MinionId: ${minionId}`);
        res.sendStatus(404);
    } else {
        req.id = minionId;

        next();
    }
})


apiRouter.route('/minions')
    .get((req, res, next) => {
        res.send(getAllFromDatabase('minions'));
    })
    .post((req, res, next) => {
        const { name, title, weaknesses, salary } = req.body
        if (typeof name === 'string' && typeof title === 'string' 
            && typeof title === 'string' && typeof salary === 'number') {
            const instance = {
                name: name,
                title: title,
                weaknesses: weaknesses,
                salary: salary
            }
            const databaseResponse = addToDatabase('minions', instance);

            if (databaseResponse) {
                res.status(201).send(databaseResponse);
            } else {
                res.status(400).send('Not possible to complete POST request')
            }
        } else {
            res.status(400).send("Wrong information type")
        }
    })


apiRouter.route('/minions/:minionId')
    .get((req, res, next) => {
        const minion = getFromDatabaseById('minions', req.id);

        if (minion) {
            res.send(minion);
        } else {
            res.status(404).send('Not found')
        }
    })
    .put((req, res, next) => {
        const minionInfo = getFromDatabaseById('minions', req.id);
        if (minionInfo === undefined) {
            res.sendStatus(404);
        }

        const instance = {
            name: req.body.name || minionInfo.name,
            title: req.body.title || minionInfo.title,
            id: minionInfo.id,
            weaknesses: req.body.weaknesses || minionInfo.weaknesses,
            salary: req.body.salary || minionInfo.salary
        }
        const minion = updateInstanceInDatabase('minions', instance)
        
        if (!minion) {
            res.sendStatus(400);
        } else {
            res.send(minion);
        }
    })
    .delete((req, res, next) => {
        const wasMinionDeleted = deleteFromDatabasebyId('minions', req.id);

        if (wasMinionDeleted) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    })

module.exports = apiRouter;
