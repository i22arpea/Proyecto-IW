import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// File path for words JSON
const wordsFile = join(process.cwd(), './api/json/palabras_5.json');

// Functions for words
export const getWord = async (): Promise<string> => {
  try {
    const raw = readFileSync(wordsFile, 'utf-8');
    const data = JSON.parse(raw);
    // Devuelve la primera palabra como ejemplo
    return data[0] || '';
  } catch (error) {
    console.error('Error fetching word from file:', error);
    throw error;
  }
};

export const setWord = async (_word: string) => {
  // No implementado: aquí podrías guardar la palabra en MongoDB si lo deseas
  console.warn('setWord no implementado sin Redis.');
};

export const setRandomWord = async (): Promise<string> => {
  try {
    const raw = readFileSync(wordsFile, 'utf-8');
    const data = JSON.parse(raw);
    const randomWord = data[Math.floor(Math.random() * data.length)];
    // Aquí podrías guardar la palabra en MongoDB si lo deseas
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
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://i22arpea:Arroyo02@cluster0.zio55q0.mongodb.net/';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;