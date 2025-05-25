import React, { useState, useEffect, useCallback } from 'react';

interface BoardProps {
  children?: React.ReactNode;
}

export default function Board({ children }: BoardProps) {
  const [gameEnded, setGameEnded] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [startTime] = useState(Date.now());

  const handleGameEnd = useCallback(
    async (result: 'win' | 'lose') => {
      setGameEnded(true);
      const duration = Math.floor((Date.now() - startTime) / 1000);

      try {
        const response = await fetch('/api/save-game', {
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
          console.error('Error saving game:', await response.text());
        }
      } catch (error) {
        console.error('Network error:', error);
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

  function renderSquare(i: number) {
    return (
      <button
        aria-label="square"
        className="square"
        type="button"
        value={i}
        onClick={() => setAttemptsUsed(attemptsUsed + 1)}
      />
    );
  }

  return (
    <main className="board-flex">
      <div className="board">
        {children}
        <div className="fila">
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="fila">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
          {renderSquare(9)}
          {renderSquare(10)}
        </div>
        <div className="fila">
          {renderSquare(11)}
          {renderSquare(12)}
          {renderSquare(13)}
          {renderSquare(14)}
          {renderSquare(15)}
        </div>
        <div className="fila">
          {renderSquare(16)}
          {renderSquare(17)}
          {renderSquare(18)}
          {renderSquare(19)}
          {renderSquare(20)}
        </div>
        <div className="fila">
          {renderSquare(21)}
          {renderSquare(22)}
          {renderSquare(23)}
          {renderSquare(24)}
          {renderSquare(25)}
        </div>
        <div className="fila">
          {renderSquare(26)}
          {renderSquare(27)}
          {renderSquare(28)}
          {renderSquare(29)}
          {renderSquare(30)}
        </div>
      </div>
    </main>
  );
}

Board.defaultProps = {
  children: undefined,
};
