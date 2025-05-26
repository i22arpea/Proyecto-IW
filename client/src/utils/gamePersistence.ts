// Utilidades para guardar y restaurar la partida en localStorage

import { Juego } from '../types/types';

const STORAGE_KEY = 'wordle-partida-guardada';

export async function guardarPartida(juego: Juego) {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(juego));

    await fetch('/api/partidas/guardar-progreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        secretWord: juego.dailyWord,
        attempts: juego.estadoActual,
        idioma: juego.idioma,
        categoria: juego.categoria,
        longitud: juego.longitud
      })
    });
  } catch (e) {
    // Manejar error si es necesario
  }
}

export function cargarPartida(): Juego | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function borrarPartidaGuardada() {
  localStorage.removeItem(STORAGE_KEY);
}

export function setupBeforeUnload(juego: Juego) {
  const token = localStorage.getItem('token');

  if (!token) {
    window.onbeforeunload = null;
    return;
  }

  window.onbeforeunload = (e: BeforeUnloadEvent) => {
    const mensaje = '¿Desea guardar la partida antes de salir?';
    e.preventDefault();

    e.returnValue = mensaje;

    if (window.confirm(mensaje)) {
      guardarPartida(juego);
    } else {
      borrarPartidaGuardada();
    }

    return mensaje;
  };
}

export function preguntarRestaurarPartida(): Juego | null {
  const guardada = cargarPartida();

  if (guardada) {
    if (window.confirm('Tienes una partida guardada. ¿Deseas continuarla?')) {
      return guardada;
    }

    borrarPartidaGuardada();
  }

  return null;
}
