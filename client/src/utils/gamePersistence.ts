// Utilidades para guardar y restaurar la partida en localStorage

import { Juego } from '../types/types';

const STORAGE_KEY = 'wordle-partida-guardada';

export async function guardarPartida(juego: Juego) {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  try {
    // Guardar también el estado visual de las celdas
    const squares = Array.from(document.getElementsByClassName('square')).map(sq => ({
      text: sq.textContent,
      classList: Array.from(sq.classList),
    }));

    const juegoConCeldas = { ...juego, squaresState: squares };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(juegoConCeldas));

    await fetch('/api/partidas/guardar-progreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        secretWord: juego.dailyWord,
        attempts: juego.estadoActual,
        hardModeMustContain: juego.hardModeMustContain,
        row: juego.row,
        position: juego.position,
        idioma: juego.idioma,
        categoria: juego.categoria,
        longitud: juego.longitud,
        squaresState: squares
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
    // El navegador moderno ignora confirm() en beforeunload, solo muestra el mensaje nativo.
    // Por accesibilidad y cumplimiento de ESLint, no usar confirm aquí.
    guardarPartida(juego);
    return mensaje;
  };
}

export function preguntarRestaurarPartida(): Juego | null {
  const guardada = cargarPartida();

  if (guardada) {
    // Reemplazar confirm por notificación visual si se desea, aquí solo devolvemos la partida guardada directamente.
    return guardada;
  }

  return null;
}

export function restaurarCeldasVisuales(squaresState?: Array<{ text: string | null; classList: string[] }>) {
  if (!squaresState) return;
  const squares = document.getElementsByClassName('square');
  for (let i = 0; i < squaresState.length; i++) {
    if (squares[i]) {
      // Limpia clases previas excepto 'square'
      squares[i].className = 'square';
      // Añade las clases guardadas (excepto 'square' para evitar duplicados)
      squaresState[i].classList.forEach(cl => {
        if (cl !== 'square') squares[i].classList.add(cl);
      });
      // Restaura el texto
      squares[i].textContent = squaresState[i].text || '';
    }
  }
}
