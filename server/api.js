const express = require('express');
const { createMeeting,
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    deleteAllFromDatabase } = require('./db.js'); 
const apiRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');
const morgan = require('morgan');

apiRouter.use(morgan('dev'));

apiRouter.param('minionId', (req, res, next, minionId) => {
    if (isNaN(Number(minionId))) {
        res.sendStatus(404);
    } else {
        req.id = minionId;

        next();
    }
})

apiRouter.param('ideaId', (req, res, next, ideaId) => {
    if (isNaN(Number(ideaId))) {
        res.sendStatus(404);
    } else {
        req.id = ideaId;

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


apiRouter.route('/ideas')
    .get((req, res, next) => {
        const ideas = getAllFromDatabase('ideas');

        res.send(ideas);
    })
    .post(checkMillionDollarIdea, (req, res, next) => {
        const { name, description, weeklyRevenue, numWeeks } = req.body;
        const instance = {
            name: name || '',
            description: description || '',
            weeklyRevenue: weeklyRevenue,
            numWeeks: numWeeks
        }
        const databaseResponse = addToDatabase('ideas', instance);

        if (databaseResponse) {
            res.status(201).send(databaseResponse);
        } else {
            res.status(400).send('Not possible to complete POST request');
        }
    })

apiRouter.route('/ideas/:ideaId')
    .get((req, res, next) => {
        const idea = getFromDatabaseById('ideas', req.id);

        if (idea) {
            res.send(idea)
        } else {
            res.status(404).send('Not Found')
        }
    })
    .put((req, res, next) => {
        const ideaInfo = getFromDatabaseById('ideas', req.id);
        if (ideaInfo === undefined) {
            res.sendStatus(404);
        }

        const instance = {
            name: req.body.name || ideaInfo.name,
            description: req.body.description || ideaInfo.description,
            id: ideaInfo.id,
            weeklyRevenue: req.body.weeklyRevenue || ideaInfo.weeklyRevenue,
            numWeeks: req.body.numWeeks || ideaInfo.numWeeks
        }
        const idea = updateInstanceInDatabase('ideas', instance);

        if (!idea) {
            res.sendStatus(400);
        } else {
            res.send(idea);
        }
    })
    .delete((req, res, next) => {
        const wasIdeaDeleted = deleteFromDatabasebyId('ideas', req.id);

        if (wasIdeaDeleted) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    })

apiRouter.route('/meetings')
    .get((req, res, next) => {
        const meetings = getAllFromDatabase('meetings');

        res.send(meetings);
    })
    .post((req, res, next) => {
        const instance = createMeeting();
        const meeting = addToDatabase('meetings', instance);

        res.status(201).send(meeting);
    })
    .delete((req, res, next) => {
        const meetings = deleteAllFromDatabase('meetings');

        res.status(204).send();
    })

module.exports = apiRouter;
