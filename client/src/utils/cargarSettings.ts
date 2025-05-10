import { Juego } from '../types/types';

export default function cargarSettings(juego: Juego) {
  const { style } = document.documentElement;

  if (juego.modoDaltonico) {
    style.setProperty('--color-correcto', '#86c1f6');
    style.setProperty('--color-presente', '#f47842');
  } else {
    style.setProperty('--color-correcto', '#6ca969');
    style.setProperty('--color-presente', '#c9b360');
  }
  const backspaceIcon = document.querySelector('.icon-tabler-backspace');

  if (!backspaceIcon) {
    console.error('Cant get backspaceIcon');

    return;
  }

  if (juego.modoOscuro) {
    backspaceIcon.outerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-backspace" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#f5f5f5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z"></path><path d="M12 10l4 4m0 -4l-4 4"></path></svg>';
    style.setProperty('--color-fondo', '#121213');
    style.setProperty('--color-texto', '#f5f5f5');
    style.setProperty('--color-tecla', '#818384');
    style.setProperty('--color-separador', '#404040');
    style.setProperty('--color-letras', '#ffffff');
    style.setProperty('--color-incorrecto', '#3a3a3c');
  } else {
    backspaceIcon.outerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-backspace" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z"></path><path d="M12 10l4 4m0 -4l-4 4"></path></svg>';
    style.setProperty('--color-fondo', '#ffffff');
    style.setProperty('--color-texto', '#111826');
    style.setProperty('--color-tecla', '#d3d6da');
    style.setProperty('--color-separador', '#d4d4d4');
    style.setProperty('--color-letras', '#000000');
    style.setProperty('--color-incorrecto', '#787c7e');
  }
}
