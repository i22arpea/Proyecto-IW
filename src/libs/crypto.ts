import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_SECRET_KEY;

function encriptarPalabra(palabra: string): string {
  if (secretKey) {
    return CryptoJS.AES.encrypt(palabra, secretKey).toString();
  }
  console.error('Secret key is undefined');

  return '';
}

function desencriptarPalabra(encriptado: string): string {
  if (secretKey) {
    return CryptoJS.AES.decrypt(encriptado, secretKey).toString(CryptoJS.enc.Utf8);
  }
  console.error('Secret key is undefined');

  return '';
}

export { encriptarPalabra, desencriptarPalabra };
