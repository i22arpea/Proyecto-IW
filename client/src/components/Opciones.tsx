import React, { useState } from 'react';
import { Juego } from '../types/types';
import cargarSettings from '../utils/cargarOpciones';
import displayMenu from '../utils/desplegarMenu';
import restartGame from '../utils/resetearJuego';

interface SettingsProps {
  juego: Juego;
  setJuego: React.Dispatch<React.SetStateAction<Juego>>;
  children?: React.ReactNode;
}

export default function Settings({ juego, setJuego, children }: SettingsProps) {

  const [language, setLanguage] = useState('es');
  const [category, setCategory] = useState('general');
  const [wordLength, setWordLength] = useState(5);


  function cambiarModoDificil() {
    const newState = restartGame(juego);
    setJuego({ ...newState, dificil: !juego.dificil });
  }

  function cambiarModoOscuro() {
    const newState = { ...juego, modoOscuro: !juego.modoOscuro };
    setJuego(newState);
    cargarSettings(newState);

    // Update the body class and localStorage for theme
    if (newState.modoOscuro) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }

    // Ensure settings page background updates
    const settingsContainer = document.querySelector<HTMLElement>('.settings-container');
    if (settingsContainer) {
      settingsContainer.style.background = newState.modoOscuro ? 'var(--color-fondo)' : '#ffffff';
    }
  }

  async function aplicarPreferencias() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const prefs = {
      language,
      category: language === 'en' ? 'general' : category,
      wordLength: language === 'en' ? 5 : wordLength
    };

    // Guardar en el backend
    await fetch('/api/usuarios/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...prefs,
        customColors: {
          backgroundColor: juego.modoOscuro ? '#0f0f0f' : '#ffffff',
          letterColor: '#eeeeee'
        }
      }),
    });

    // Obtener nueva palabra y actualizar el estado del juego
    const res = await fetch('/api/partidas/nueva', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const palabra = data.word ?? data.palabra ?? '';

    const newGameState = restartGame(juego);
    setJuego({
      ...newGameState,
      dailyWord: palabra,
      idioma: prefs.language,
      categoria: prefs.category,
      longitud: prefs.wordLength
    });
  }

  return (
    <div className="settings">
      {children}
      <div className="settings-container">
        <h3 className="settings-titulo">
          Ajustes
          <button aria-label="Cerrar ayuda" className="ayuda-salir" type="button">
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
            <label className="settings-opcion__texto">Idioma</label>
            <select
              className="settings-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ backgroundColor: '#181a1b', color: '#fff', borderRadius: '8px', border: '1px solid #1ed760', padding: '6px' }}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          <div className="settings-opcion">
            <label className="settings-opcion__texto">Temática</label>
            <select
              className="settings-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={language === 'en'}
              style={{ backgroundColor: '#181a1b', color: '#fff', borderRadius: '8px', border: '1px solid #1ed760', padding: '6px' }}
            >
              <option value="general">General</option>
              <option value="paises">Países</option>
              <option value="animales">Animales</option>
            </select>
          </div>

          <div className="settings-opcion">
            <label className="settings-opcion__texto">Longitud de palabra</label>
            <select
              className="settings-select"
              value={wordLength}
              onChange={(e) => setWordLength(Number(e.target.value))}
              disabled={language === 'en'}
              style={{ backgroundColor: '#181a1b', color: '#fff', borderRadius: '8px', border: '1px solid #1ed760', padding: '6px' }}
            >
              {[5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

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
                  onChange={cambiarModoOscuro}
                />
                <label className="onoffswitch-label" htmlFor="myonoffswitch-3" />
              </div>
            </div>
          </div>

          <div className="settings-opcion">
            <div style={{ flex: 1 }}>
              <p className="settings-opcion__texto">Modo Difícil</p>
              <p className="settings-opcion__subtexto">
                Más palabras pero sin ser verificadas. <br />
                Todas las pistas reveladas deberán ser utilizadas en los intentos siguientes.
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
                  onChange={cambiarModoDificil}
                />
                <label className="onoffswitch-label" htmlFor="myonoffswitch-1" />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={aplicarPreferencias}
              style={{
                backgroundColor: '#1ed760',
                color: '#181a1b',
                border: 'none',
                padding: '10px 20px',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Aplicar cambios
            </button>
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
        <a href="https://github.com/i22arpea/Proyecto-IW">Proyecto-IW</a>
      </footer>
    </div>
  );
}

Settings.defaultProps = {
  children: undefined,
};
