const { Router } = require('express');
const {
    checkWord,
    getDailyWord,
    getNewWord,
    getPing,
    getRandom,
    setDailyWord,
} = require('../controllers/server.controllers');

const router = Router();

router
    .get('/ping', getPing)
    .get('/api/wordle', getDailyWord)
    .get('/api/wordle/checkword/:word', checkWord)
    .get('/api/wordle/updateword', getNewWord)
    .get('/api/wordle/setword/:word', setDailyWord)
    .get('/api/wordle/random', getRandom);

module.exports = router;
