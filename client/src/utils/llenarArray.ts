import { Juego } from '../types/types';

// Returns a new state to avoid breaking react rules.
export default function llenarArray(juego: Juego) {
  const newState = { ...juego };

  const square = document.querySelectorAll('.square');
  const newArray: string[] = [];

  for (let i = 0; i < square.length; i++) {
    const content = square[i].textContent;

    if (content) {
      newArray.push(content);
    } else {
      newArray.push('');
    }
  }

  newState.estadoActual = newArray;

  return newState;
}
