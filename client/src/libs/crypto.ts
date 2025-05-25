// Extiende la interfaz Window para incluir REACT_APP_SECRET_KEY
declare global {
  interface Window {
    REACT_APP_SECRET_KEY?: string;
  }
}

export function encriptarPalabra(palabra: string): string {
  // Devuelve la palabra original para que se muestre en el historial
  return palabra;
}

export function desencriptarPalabra(palabra: string): string {
  // Devuelve la palabra original para que se muestre en el historial
  return palabra;
}


