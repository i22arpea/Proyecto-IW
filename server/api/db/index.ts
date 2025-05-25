import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/word';

dotenv.config();

// File path for words JSON
// const wordsFile = join(process.cwd(), './api/json/palabras_5.json');

// Functions for words
export const getWord = async (): Promise<string> => {
  try {
    // Buscar la primera palabra en la colección
    const wordDoc = await Word.findOne();
    return wordDoc?.text || '';
  } catch (error) {
    console.error('Error fetching word from DB:', error);
    throw error;
  }
};

export const setWord = async (_word: string) => {
  // Puedes guardar la palabra en MongoDB si lo deseas
  try {
    await Word.create({ text: _word, language: 'es', category: 'general', length: _word.length });
  } catch (error) {
    console.error('Error saving word to DB:', error);
  }
};

export const setRandomWord = async (): Promise<string> => {
  try {
    // Contar total de palabras
    const count = await Word.countDocuments();
    const random = Math.floor(Math.random() * count);
    const wordDoc = await Word.findOne().skip(random);
    return wordDoc?.text || '';
  } catch (error) {
    console.error('Error setting random word from DB:', error);
    throw error;
  }
};

export const getRandomWord = async (): Promise<string> => {
  try {
    const count = await Word.countDocuments();
    const random = Math.floor(Math.random() * count);
    const wordDoc = await Word.findOne().skip(random);
    return wordDoc?.text || '';
  } catch (error) {
    console.error('Error fetching random word from DB:', error);
    throw error;
  }
};

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI!;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;