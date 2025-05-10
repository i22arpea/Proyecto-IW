// Returns a new state to avoid breaking react rules.

import { Juego } from '../types/types';

// ? Las cargo despues para que cuando simule el escribir no le sume stats que no hizo.
export default function recuperarStats(juego: Juego) {
  const data = localStorage.getItem('juego');
  let lastGame = juego;

  if (data) {
    const parse = JSON.parse(data);

    lastGame = {
      ...juego,
      victorias: parse.victorias,
      distribucion: parse.distribucion,
      jugadas: parse.jugadas,
      streak: parse.streak,
      maxStreak: parse.maxStreak,
      position: parse.position,
      row: parse.row,
    };
  }

  return lastGame;
}
