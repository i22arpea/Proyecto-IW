import { Request, Response } from 'express';
import {
  getRandomWord, getWord, setRandomWord, setWord,
} from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

const getUserByUsername = async (username: string): Promise<IUser | null> => {
  return await User.findOne({ username });
};

export const getPing = async (req: Request, res: Response) => res.send('Pong');

export const getDailyWord = async (req: Request, res: Response) => {
  try {
    const daily = await getWord();
    res.json({ dailyWord: daily });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily word' });
  }
};

export const checkWord = async (req: Request, res: Response) => {
  try {
    const daily = await getWord();
    const { word } = req.params;

    if (daily === word) {
      return res.json({ status: 'correct' });
    }
    return res.json({ status: 'incorrect' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check word' });
  }
};

export const getNewWord = async (req: Request, res: Response) => {
  try {
    const word = await setRandomWord();
    res.json({ status: `Daily word set to ${word}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set new daily word' });
  }
};

export const setDailyWord = async (req: Request, res: Response) => {
  try {
    const { word } = req.params;
    await setWord(word);
    res.json({ status: `Daily word set to ${word}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set daily word' });
  }
};

export const getRandom = async (req: Request, res: Response) => {
  try {
    const word = getRandomWord();
    res.json({ word });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random word' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};