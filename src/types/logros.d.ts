// Definición de tipos para logros
export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  obtenido: boolean;
}

export interface LogrosUsuario {
  logros: Logro[];
}
