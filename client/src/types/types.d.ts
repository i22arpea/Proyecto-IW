interface Distribucion {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  X: number;
}

interface Letters {
  letter: string;
  position: number;
}

export interface Juego {
  position: number;
  row: number;
  dificil: boolean;
  modoOscuro: boolean;
  modoDaltonico: boolean;
  dailyWord: string;
  juegoFinalizado: boolean;
  jugadas: number;
  victorias: number;
  distribucion: Record<Distribucion>;
  estadoActual: Array<string>;
  streak: number;
  maxStreak: number;
  hardModeMustContain: Array<Letters>;
}
