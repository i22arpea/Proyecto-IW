

// Extiende la interfaz Window para incluir REACT_APP_SECRET_KEY
declare global {
  interface Window {
    REACT_APP_SECRET_KEY?: string;
  }
}

function getSecretKey(): string {
  return (
    process.env.REACT_APP_SECRET_KEY ||
    window.REACT_APP_SECRET_KEY ||
    'default_secret_key'
  );
}


export function encriptarPalabra(palabra: string): string {
  return palabra; // ya no se encripta
}

export function desencriptarPalabra(palabra: string): string {
  return palabra; // tampoco se desencripta
}


