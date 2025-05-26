import { toast, Zoom } from 'react-toastify';
import { desencriptarPalabra } from '../libs/crypto';
import { Juego } from '../types/types';
import diccionario from '../json/final_dictionary.json';

let juegoActual: Juego;

// Guardar letras correctas bloqueadas por fila
let lockedLetters: { [row: number]: { [col: number]: string } } = {};

function movePosition(stepForward = true) {
  if (stepForward) {
    const nextPosition = juegoActual.position + 1;

    if (nextPosition <= juegoActual.row * 5) {
      juegoActual.position = nextPosition;
    }
  } else {
    const previousPosition = juegoActual.position - 1;

    if (previousPosition >= juegoActual.row * 5 - 4) {
      juegoActual.position = previousPosition;
    }
  }
}

function indexOfChars(str: string, char: string): number[] {
  const indexes: number[] = [];

  const split = str.split('');

  for (let i = 0; i < split.length; i++) {
    if (char === str[i]) {
      indexes.push(i);
    }
  }

  return indexes;
}

// Envía la partida finalizada al backend si el usuario está logueado
async function registrarPartidaFinalizada({ won }: { won: boolean }) {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    await fetch('/api/partidas/finalizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        secretWord: juegoActual.dailyWord,
        won,
        attemptsUsed: juegoActual.row <= 6 ? juegoActual.row : 6,
      }),
    });
  } catch (err) {
    // Silenciar errores
  }
}

function checkWord() {
  let word = '';

  const square = document.querySelectorAll<HTMLElement>('.square');

  for (let i = juegoActual.row * 5 - 5; i < juegoActual.row * 5; i++) {
    if (!square[i]) {
      // console.warn(`La celda ${i} no existe aún.`);

      return false;
    }

    word += square[i].textContent || '';
  }

  if (word.length !== 5) {
    toast.info('No hay suficientes letras', {
      position: 'top-center',
      className: 'toast',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
    });

    return false;
  }

  const cantidadRepetidos: Record<string, number> = {};

  if (!juegoActual.dailyWord || typeof juegoActual.dailyWord !== 'string') {
    // console.error('Error: dailyWord no está definida correctamente.');
    return false;
  }

  const palabra = desencriptarPalabra(juegoActual.dailyWord);

  // console.log('Palabra diaria:', palabra); // <-- Mostrar palabra diaria por consola

  for (let i = 0; i < palabra.length; i++) {
    cantidadRepetidos[palabra[i]] = 0;
  }

  for (let i = 0; i < palabra.length; i++) {
    cantidadRepetidos[palabra[i]] += 1;
  }

  word = word.toLowerCase();

  if (!diccionario.includes(word)) {
    toast.info('La palabra no está en el diccionario', {
      position: 'top-center',
      className: 'toast',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
    });

    return false;
  }

  if (juegoActual.dificil) {
    for (let i = 0; i < juegoActual.hardModeMustContain.length; i++) {
      const { letter, position } = juegoActual.hardModeMustContain[i];

      if (!word.includes(letter) && position === 0) {
        toast.info(`El intento debe contener ${letter.toUpperCase()}`, {
          position: 'top-center',
          className: 'toast',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Zoom,
        });

        return false;
      }

      const indexes = indexOfChars(word, letter);

      if (!indexes.includes(position - 1) && position !== 0) {
        toast.info(`El intento debe contener ${letter.toUpperCase()} en la ${position} posicion`, {
          position: 'top-center',
          className: 'toast',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Zoom,
        });

        return false;
      }
    }

    juegoActual.hardModeMustContain = [];
  }

  let delay = 0;

  for (let i = 0; i < 5; i++) {
    square[i + 5 * (juegoActual.row - 1)].style.animationDelay = `${delay}s`;
    square[i + 5 * (juegoActual.row - 1)].style.transitionDelay = `${delay}s`;
    delay += 0.4;
    square[i + 5 * (juegoActual.row - 1)].classList.add('scale-up-center');

    if (word[i] === desencriptarPalabra(juegoActual.dailyWord)[i]) {
      square[i + 5 * (juegoActual.row - 1)].classList.add('correcto');

      const squareLetter = document.getElementById(word[i].toUpperCase());
      juegoActual.hardModeMustContain.push({ letter: word[i], position: i + 1 });

      if (!squareLetter) {
        throw new Error("Can't get actual square");
      }

      squareLetter.classList.add('correcto');
      cantidadRepetidos[word[i]] -= 1;

      // Guardar la letra correcta bloqueada para la siguiente fila
      if (!lockedLetters[juegoActual.row]) lockedLetters[juegoActual.row] = {};
      lockedLetters[juegoActual.row][i] = word[i];

      // Mostrar visualmente la celda bloqueada en la siguiente fila
      const nextRowSquare = square[i + 5 * (juegoActual.row)];
      if (nextRowSquare) {
        nextRowSquare.textContent = word[i].toUpperCase();
        nextRowSquare.classList.add('correcto', 'locked-correct');
        nextRowSquare.setAttribute('aria-disabled', 'true');
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    const squareLetter = document.getElementById(word[i].toUpperCase());

    if (!squareLetter) {
      throw new Error("Can't get actual square");
    }

    if (
      desencriptarPalabra(juegoActual.dailyWord).includes(word[i]) &&
      cantidadRepetidos[word[i]] > 0
    ) {
      square[i + 5 * (juegoActual.row - 1)].classList.add('presente');
      juegoActual.hardModeMustContain.push({ letter: word[i], position: 0 });
      squareLetter.classList.add('presente');
      cantidadRepetidos[word[i]] -= 1;
    } else {
      square[i + 5 * (juegoActual.row - 1)].classList.add('incorrecto');
      squareLetter.classList.add('incorrecto');
    }
  }

  if (word === desencriptarPalabra(juegoActual.dailyWord)) {

    toast.success('Felicitaciones, acertaste!!', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      draggable: true,
      progress: undefined,
    });

    const nuevasJugadas = juegoActual.jugadas + 1;
    const nuevasVictorias = juegoActual.victorias + 1;
    const nuevaRacha = juegoActual.streak + 1;
    let nuevaMayorRacha = juegoActual.maxStreak;

    if (nuevaRacha > nuevaMayorRacha) {
      nuevaMayorRacha = nuevaRacha;
    }

    const nuevaDistribucion = { ...juegoActual.distribucion };
    
    nuevaDistribucion[juegoActual.row] += 1;

    juegoActual = {
      ...juegoActual,
      juegoFinalizado: true,
      jugadas: nuevasJugadas,
      victorias: nuevasVictorias,
      distribucion: nuevaDistribucion,
      streak: nuevaRacha,
      maxStreak: nuevaMayorRacha,
    };

    registrarPartidaFinalizada({ won: true });
  }

  return true;
}

function moveRow() {
  if (juegoActual.position % 5 !== 0) {
    return;
  }

  const nextRow = juegoActual.row + 1;

  const nextPosition = juegoActual.position + 1;

  juegoActual = {
    ...juegoActual,
    row: nextRow,
    position: nextPosition,
  };
}

function fallaste() {
  if (juegoActual.juegoFinalizado) {
    return;
  }

  if (juegoActual.position === 31 && juegoActual.row === 7) {

    toast.error(`Fallaste, la palabra era ${desencriptarPalabra(juegoActual.dailyWord)}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      draggable: true,
      progress: undefined,
    });

    const nuevasJugadas = juegoActual.jugadas + 1;

    const nuevaDistribucion = { ...juegoActual.distribucion };
    
    nuevaDistribucion.X += 1;

    juegoActual = {
      ...juegoActual,
      juegoFinalizado: true,
      jugadas: nuevasJugadas,
      distribucion: nuevaDistribucion,
      streak: 0,
    };

    registrarPartidaFinalizada({ won: false });
  }
}

// Returns a new state to avoid breaking react rules.
function keyPress(e: string, juego: Juego): Juego {
  juegoActual = juego;

  let square = document.getElementsByClassName('square')[juegoActual.position - 1] as HTMLElement;

  // --- NUEVO: resaltar celda activa ---
  // Elimina la clase de resaltado de todas las celdas
  Array.from(document.getElementsByClassName('square')).forEach(sq => {
    sq.classList.remove('active-cell');
  });

  // Añade la clase a la celda activa si existe
  if (square) {
    square.classList.add('active-cell');
  }

  // --- FIN NUEVO ---

  // Si la posición está bloqueada por una letra correcta de la fila anterior, saltar automáticamente a la siguiente celda editable
  if (
    square &&
    juegoActual.position > 5 &&
    lockedLetters[juegoActual.row - 1]
  ) {
    let col = (juegoActual.position - 1) % 5;

    let intentos = 0;

    const longitud = juegoActual.longitud || 5;

    // Si la última celda de la fila está bloqueada, no intentar avanzar más
    if (
      col === longitud - 1 &&
      lockedLetters[juegoActual.row - 1][col] &&
      square.classList.contains('locked-correct')
    ) {
      // Solo bloquear escritura de letras, pero permitir Enter y Backspace
      if (e.length === 1 && /[a-zA-Z]/.test(e)) {
        return juegoActual;
      }
      // Si es Enter o Backspace, dejar que siga el flujo normal
    }

    // Si la celda está bloqueada
    while (lockedLetters[juegoActual.row - 1][col] && square && intentos < longitud) {
      // Si la celda está vacía, la rellenamos automáticamente
      if (square && square.textContent === '') {
        square.textContent = lockedLetters[juegoActual.row - 1][col].toUpperCase();
        square.classList.add('correcto', 'locked-correct');
        square.setAttribute('aria-disabled', 'true');
      }

      // Avanzar a la siguiente celda
      movePosition();

      // Actualizar square y col
      square = document.getElementsByClassName('square')[juegoActual.position - 1] as HTMLElement;
      col = (juegoActual.position - 1) % longitud;
      intentos += intentos;

      // Si nos salimos de la fila, salimos del bucle
      if (col === 0) break;

      // Si la nueva celda es la última y está bloqueada, salir
      if (
        col === longitud - 1 &&
        lockedLetters[juegoActual.row - 1][col] &&
        square && square.classList.contains('locked-correct')
      ) {
        break;
      }
    }
  }

  // Bloquear letras correctas en la siguiente fila
  if (
    square &&
    square.textContent === '' &&
    /[a-zA-Z]/.test(e) &&
    juegoActual.position > 5 &&
    lockedLetters[juegoActual.row - 1]
  ) {
    const col = (juegoActual.position - 1) % 5;

    const locked = lockedLetters[juegoActual.row - 1][col];

    if (locked) {
      // Si la letra es diferente a la bloqueada, no permitir escribir
      if (e.toLowerCase() !== locked.toLowerCase()) {
        toast.info(`La letra en esta posición debe ser '${locked.toUpperCase()}'`, {
          position: 'top-center',
          className: 'toast',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Zoom,
        });

        return juegoActual;
      }
    }
  }

  if (e === 'Backspace') {

    // Si la celda es locked-correct, mover a la anterior hasta encontrar una editable
    let guard = 0; // Evita bucles infinitos

    while (square && square.classList.contains('locked-correct') && guard < 10) {
      const currentSquare = square;
      currentSquare.classList.add('shake');
      setTimeout(() => currentSquare.classList.remove('shake'), 300);

      if (juegoActual.position === 1) {
        return juegoActual;
      }

      movePosition(false);
      square = document.getElementsByClassName('square')[juegoActual.position - 1] as HTMLElement;
      guard += 1;
    }

    if (square && square.textContent === '') {
      movePosition(false);
      square = document.getElementsByClassName('square')[juegoActual.position - 1] as HTMLElement;
      guard = 0;

      while (square && square.classList.contains('locked-correct') && guard < 10) {
        const currentSquare = square;
        currentSquare.classList.add('shake');
        setTimeout(() => currentSquare.classList.remove('shake'), 300);

        if (juegoActual.position === 1) {
          return juegoActual;
        }

        movePosition(false);
        square = document.getElementsByClassName('square')[juegoActual.position - 1] as HTMLElement;
        guard += 1;
      }
    }

    if (square) {
      square.textContent = '';
      square.classList.remove('correcto', 'presente', 'locked-correct');
    }

  } else if (e === 'Enter') {

    const existe = checkWord();

    if (existe) {
      moveRow();
    }

  } else if (
    e.length === 1 &&
    square &&
    square.textContent === '' &&
    /[a-zA-Z]/.test(e)
  ) {

    // Solo permitir escribir en la fila actual
    const longitud = juegoActual.longitud || 5;

    const filaActual = juegoActual.row;

    const index = juegoActual.position - 1;

    const filaDeCelda = Math.floor(index / longitud) + 1;

    // Si no es la fila actual, no permitir escribir
    if (filaDeCelda !== filaActual) {
      return juegoActual;
    }

    // Si la posición es la última de la fila, no permitir escribir más
    if (juegoActual.position % longitud === 0 && square.textContent === '') {
      // Solo permitir escribir en la última celda vacía, pero no avanzar ni permitir más
      const span = document.createElement('span');
      span.textContent = e.toUpperCase();
      span.className = 'cell-letter';
      square.appendChild(span);
      square.classList.add('filled');

      // No mover posición ni fila
      return juegoActual;
    }

    // Si ya está llena la fila, no permitir escribir
    if (juegoActual.position % longitud === 0 && square.textContent !== '') {
      return juegoActual;
    }

    // Envolver la letra en un span para aplicar estilo
    const span = document.createElement('span');
    span.textContent = e.toUpperCase();
    span.className = 'cell-letter';
    square.appendChild(span);
    square.classList.add('filled');
    movePosition();
  }

  fallaste();

  return juegoActual;
}

// Limpiar lockedLetters al reiniciar el juego
export function resetLockedLetters() {
  lockedLetters = {};
}

export default keyPress;
