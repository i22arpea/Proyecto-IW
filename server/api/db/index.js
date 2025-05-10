const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const Redis = require('ioredis');
const { join } = require('path');

dotenv.config();

const wordsFile = join(process.cwd(), './api/json/palabras_5.json');
const client = new Redis(process.env.REDIS_URL);

client.on('error', (e) => {
    console.error(e);
    throw e;
});

const getWord = async () => {
    const word = await client.get('dailyWord');
    return word || '';
};

const setWord = async (word) => {
    await client.set('dailyWord', word);
};

const setRandomWord = async () => {
    const raw = readFileSync(wordsFile, 'utf-8');
    const data = JSON.parse(raw);
    const randomWord = data[Math.floor(Math.random() * data.length)];
    await setWord(randomWord);
    return randomWord;
};

const getRandomWord = () => {
    const raw = readFileSync(wordsFile, 'utf-8');
    const data = JSON.parse(raw);
    return data[Math.floor(Math.random() * data.length)];
};

module.exports = {
    getWord,
    setWord,
    setRandomWord,
    getRandomWord,
};
