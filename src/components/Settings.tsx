import React from 'react';
import { Juego } from '../types/types';
import cargarSettings from '../utils/cargarSettings';
import displayMenu from '../utils/displayMenu';
import restartGame from '../utils/restartGame';

interface SettingsProps {
  juego: Juego;
  setJuego: React.Dispatch<React.SetStateAction<Juego>>;
}

export default function Settings({ juego, setJuego }: SettingsProps) {
  function cambiarModoDificil() {
    const newState = restartGame(juego);

    setJuego({
      ...newState,
      dificil: !juego.dificil,
    });
  }

  function cambiarModoOscuro() {
    const newState = {
      ...juego,
      modoOscuro: !juego.modoOscuro,
    };

    setJuego(newState);
    cargarSettings(newState);
  }

  function cambiarModoDaltonico() {
    const newState = {
      ...juego,
      modoDaltonico: !juego.modoDaltonico,
    };

    setJuego(newState);
    cargarSettings(newState);
  }

  return (
    <div className="settings">
      <div className="settings-container">
        <h3 className="settings-titulo">
          Ajustes
          <button className="ayuda-salir" type="button">
            <svg
              className="icon icon-tabler icon-tabler-x"
              fill="none"
              height="24"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => displayMenu('.game-settings')}
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </h3>
        <div className="settings-opciones">
          <div className="settings-opcion">
            <div>
              <p className="settings-opcion__texto">Modo Oscuro</p>
            </div>
            <div>
              <div className="onoffswitch">
                <input
                  checked={juego.modoOscuro}
                  className="onoffswitch-checkbox"
                  id="myonoffswitch-3"
                  name="onoffswitch"
                  tabIndex={-3}
                  type="checkbox"
                  onChange={() => cambiarModoOscuro()}
                />
                <label className="onoffswitch-label" htmlFor="myonoffswitch-3" />
              </div>
            </div>
          </div>
          <div className="settings-opcion">
            <div>
              <p className="settings-opcion__texto">Modo Dificil</p>
              <p className="settings-opcion__subtexto">
                Mas palabras pero sin ser verificadas. <br />
                Todas las pistas reveladas deberan ser utilizadas en los intentos siguientes.
              </p>
            </div>
            <div>
              <div className="onoffswitch">
                <input
                  checked={juego.dificil}
                  className="onoffswitch-checkbox"
                  id="myonoffswitch-1"
                  name="onoffswitch"
                  tabIndex={-1}
                  type="checkbox"
                  onChange={() => cambiarModoDificil()}
                />
                <label className="onoffswitch-label" htmlFor="myonoffswitch-1" />
              </div>
            </div>
          </div>
          <div className="settings-opcion">
            <div>
              <p className="settings-opcion__texto">Modo para Daltonicos</p>
            </div>
            <div>
              <div className="onoffswitch">
                <input
                  checked={juego.modoDaltonico}
                  className="onoffswitch-checkbox"
                  id="myonoffswitch-2"
                  name="onoffswitch-2"
                  tabIndex={-2}
                  type="checkbox"
                  onChange={() => cambiarModoDaltonico()}
                />
                <label className="onoffswitch-label" htmlFor="myonoffswitch-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer-ayuda">
        <svg
          className="icon icon-tabler icon-tabler-brand-github"
          fill="none"
          height="20"
          stroke="#a3a3a3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </svg>
        <a href="https://github.com/MatiasTK">MatiasTK</a>
      </footer>
    </div>
  );
}
