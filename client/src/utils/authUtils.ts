// Importar la función correctamente según la documentación de jwt-decode v4+
import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');


export const isAuthenticated = () => {

  const token = getToken();

  if (!token) return false;

  try {
    // Usar la función nombrada jwtDecode
    const decoded = jwtDecode(token) as { exp?: number };

    if (!decoded || !decoded.exp) return false;

    // exp está en segundos desde epoch
    if (Date.now() / 1000 > decoded.exp) {
      removeToken();

      return false;
    }

    return true;
  } catch {

    removeToken();
    return false;
  }
};

