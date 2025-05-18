import CryptoJS from 'crypto-js';

// Usa la variable de entorno y si no existe, usa una clave por defecto para desarrollo
const secretKey = process.env.REACT_APP_SECRET_KEY || 'palabrasecreta123';

export function encriptarPalabra(palabra: string): string {
  const clave = getSecretKey();
  const textoCifrado = CryptoJS.AES.encrypt(palabra, clave).toString();

  return textoCifrado;
}

export function desencriptarPalabra(textoCifrado: string): string {
  const clave = getSecretKey();
  const bytes = CryptoJS.AES.decrypt(textoCifrado, clave);
  const textoPlano = bytes.toString(CryptoJS.enc.Utf8);

  return textoPlano;
}

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
