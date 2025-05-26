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

              secretWord: 'example', // Replace with actual word
              attempts: ['example1', 'example2'], // Replace with actual attempts
              result,
              attemptsUsed,
              duration,
          }),
        });

          if (!response.ok) {
              // TODO: manejar error de guardado
          }
      } catch (error) {
          // TODO: manejar error de red
      }
    },
      [attemptsUsed, startTime]
  );

    useEffect(() => {
        if (gameEnded) return;

        // Example logic to detect game end (replace with actual game logic)
        if (attemptsUsed >= 6) {
            handleGameEnd('lose');
        }

        // Add logic to detect win condition and call handleGameEnd('win')
    }, [attemptsUsed, gameEnded, handleGameEnd]);

    // Determinar filas y columnas dinámicamente
    const filas = 6;
    const columnas = juego?.longitud || 5;

    function renderSquare(rowIdx: number, colIdx: number) {
        const i = rowIdx * columnas + colIdx + 1;
        // Usar un identificador único para la key del botón

        return (
            <button
                onClick={() => setAttemptsUsed(attemptsUsed + 1)}
                aria-label="square"
                className="square"
                type="button"
                value={i}
                key={`square-${i}`}
            />
        );
    }

    return (
        <main className="board-flex">
            <div className="board">
                {children}
                {Array.from({ length: filas }).map((filaVoid, rowIdx) => (
                    <div

                        className="fila"
                        style={{ display: 'grid', gridTemplateColumns: `repeat(${columnas}, 1fr)` }}
                    >
                        {Array.from({ length: columnas }).map((colVoid, colIdx) => renderSquare(rowIdx, colIdx))}
                    </div>
                ))}
            </div>
        </main>
    );
}

Board.defaultProps = {
    children: undefined,
};