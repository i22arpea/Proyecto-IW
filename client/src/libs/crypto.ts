import CryptoJS from 'crypto-js';

// Usa la variable de entorno y si no existe, usa una clave por defecto para desarrollo
const secretKey = process.env.REACT_APP_SECRET_KEY || 'palabrasecreta123';

function encriptarPalabra(palabra: string): string {
  if (secretKey) {
    return CryptoJS.AES.encrypt(palabra, secretKey).toString();
  }
  // console.error('Secret key is undefined');
  return '';
}

function desencriptarPalabra(encriptado: string): string {
  if (secretKey) {
    return CryptoJS.AES.decrypt(encriptado, secretKey).toString(CryptoJS.enc.Utf8);
  }
  // console.error('Secret key is undefined');
  return '';
}

export { encriptarPalabra, desencriptarPalabra };
