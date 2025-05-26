import React, { useState, useEffect, useCallback } from 'react';
import { Juego } from '../types/types';

interface BoardProps {
  children?: React.ReactNode;
  juego: Juego;
}

export default function Board({ children, juego }: BoardProps) {
  const [gameEnded, setGameEnded] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [startTime] = useState(Date.now());

  const handleGameEnd = useCallback(
    async (result: 'win' | 'lose') => {
      setGameEnded(true);
      const duration = Math.floor((Date.now() - startTime) / 1000);

      try {
        const response = await fetch('/Proyecto-IW/api/save-game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({

