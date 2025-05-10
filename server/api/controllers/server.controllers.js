const { getRandomWord, getWord, setRandomWord, setWord } = require('../db');

const getPing = async (req, res) => res.send('Pong');

const getDailyWord = async (req, res) => {
    const daily = await getWord();
    res.json({ dailyWord: daily });
};

const checkWord = async (req, res) => {
    const daily = await getWord();
    const { word } = req.params;

    if (daily === word) {
        return res.json({ status: 'correct' });
    }
    return res.json({ status: 'incorrect' });
};

const getNewWord = async (req, res) => {
    const word = await setRandomWord();
    res.json({ status: `Daily word set to ${word}` });
};

const setDailyWord = async (req, res) => {
    const { word } = req.params;
    await setWord(word);
    res.json({ status: `Daily word set to ${word}` });
};

const getRandom = async (req, res) => {
    const word = getRandomWord();
    res.json({ word });
};

module.exports = {
    getPing,
    getDailyWord,
    checkWord,
    getNewWord,
    setDailyWord,
    getRandom,
};
