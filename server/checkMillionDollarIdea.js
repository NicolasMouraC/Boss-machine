const express = require('express');

const checkMillionDollarIdea = (req, res, next) => {
    const { weeklyRevenue, numWeeks } = req.body;

    if (!weeklyRevenue || !numWeeks) {
        res.sendStatus(400);
    } else if (isNaN(weeklyRevenue) || isNaN(numWeeks)) {
        res.sendStatus(400);
    } else if ((weeklyRevenue * numWeeks) < 1000000) {
        res.sendStatus(400);
    } else {
        next();
    }
}

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
