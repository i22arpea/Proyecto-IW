// Lista de logros disponibles
import { Logro } from '../types/logros';

export const LOGROS: Logro[] = [
  {
    id: 'primer_partida',
    nombre: '¡Primera partida!',
    descripcion: 'Juega tu primera partida.',
    obtenido: false,
  },
  {
    id: 'primer_victoria',
    nombre: '¡Primera victoria!',
    descripcion: 'Gana tu primera partida.',
    obtenido: false,
  },
  {
    id: 'racha_5',
    nombre: 'Racha x5',
    descripcion: 'Consigue una racha de 5 victorias.',
    obtenido: false,
  },
  {
    id: 'victorias_10',
    nombre: '10 Victorias',
    descripcion: 'Gana 10 partidas.',
    obtenido: false,
  },
  // Puedes agregar más logros aquí
];
