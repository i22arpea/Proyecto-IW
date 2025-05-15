import { readFileSync } from 'fs';
import Redis from 'ioredis';
import { join } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Redis client setup
const client = new Redis(process.env.REDIS_URL!);
client.on('error', (e) => {
  console.error('Redis connection error:', e);
  throw e;
});

// File path for words JSON
const wordsFile = join(process.cwd(), './api/json/palabras_5.json');

// Redis functions
export const getWord = async (): Promise<string> => {
  try {
    const word = await client.get('dailyWord');
    return word || '';
  } catch (error) {
    console.error('Error fetching word from Redis:', error);
    throw error;
  }
};

export const setWord = async (word: string) => {
  try {
    await client.set('dailyWord', word);
  } catch (error) {
    console.error('Error setting word in Redis:', error);
    throw error;
  }
};

export const setRandomWord = async (): Promise<string> => {
  try {
    const raw = readFileSync(wordsFile, 'utf-8');
    const data = JSON.parse(raw);
    const randomWord = data[Math.floor(Math.random() * data.length)];
    await setWord(randomWord);
    return randomWord;
  } catch (error) {
    console.error('Error setting random word:', error);
    throw error;
  }
};

export const getRandomWord = (): string => {
  try {
    const raw = readFileSync(wordsFile, 'utf-8');
    const data = JSON.parse(raw);
    return data[Math.floor(Math.random() * data.length)];
  } catch (error) {
    console.error('Error fetching random word:', error);
    throw error;
  }
};

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/wordle';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;