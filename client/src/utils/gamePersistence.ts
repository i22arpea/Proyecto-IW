// Utilidades para guardar y restaurar la partida en localStorage

import { Juego } from '../types/types';

const STORAGE_KEY = 'wordle-partida-guardada';

export async function guardarPartida(juego: Juego) {
  // Solo guardar si el usuario ha iniciado sesión
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para guardar la partida.');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(juego));
    // Guardar también en la base de datos
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

// Hook para interceptar recarga/cierre y preguntar al usuario
export function setupBeforeUnload(juego: Juego) {
  // Solo mostrar el mensaje si el usuario ha iniciado sesión
  const token = localStorage.getItem('token');
  if (!token) {
    window.onbeforeunload = null;
    return;
  }
  window.onbeforeunload = (e: BeforeUnloadEvent) => {
    const mensaje = '¿Desea guardar la partida antes de salir?';
    e.preventDefault();
    // Algunos navegadores requieren que se asigne returnValue
    e.returnValue = mensaje;
    if (window.confirm(mensaje)) {
      guardarPartida(juego);
    } else {
      borrarPartidaGuardada();
    }
    return mensaje;
  };
}

// Llama a esta función al cargar la app para preguntar si restaurar
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
