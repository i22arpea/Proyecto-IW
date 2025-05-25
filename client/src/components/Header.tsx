import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Juego } from '../types/types.d';
import displayMenu from '../utils/desplegarMenu';
import llenarArray from '../utils/llenarArray';
import restartGame from '../utils/resetearJuego';
import LoginRegister from './LoginRegister';
import { isAuthenticated } from '../utils/authUtils';
import words from '../json/palabras_5.json';
import { encriptarPalabra } from '../libs/crypto';

export interface HeaderProps {
  juego: Juego;
  setJuego: React.Dispatch<React.SetStateAction<Juego>>;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
}

export default function Header({ juego, setJuego, onLoginClick, onProfileClick }: HeaderProps) {
  const [showLogin, setShowLogin] = useState(false);
  const authenticated = isAuthenticated();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div>
        <svg
          className="icon icon-tabler icon-tabler-help"
          fill="none"
          height="24"
          stroke="#525252"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => displayMenu('.game-help')}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <circle cx="12" cy="12" r="9" />
          <line x1="12" x2="12" y1="17" y2="17.01" />
          <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
        </svg>
        <svg
          className="icon icon-tabler icon-tabler-refresh"
          fill="none"
          height="24"
          stroke="#424242"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            const nuevaPalabra = words[Math.floor(Math.random() * words.length)];
            const newState = {
              ...restartGame(juego),
              dailyWord: encriptarPalabra(nuevaPalabra)
            };
            llenarArray(newState);
            setJuego(newState);
          }}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
      </div>
      <h1 className="titulo">Wordle</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Iconos de opciones */}
        <svg
          className="icon icon-tabler icon-tabler-chart-bar"
          fill="none"
          height="24"
          stroke="#525252"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => displayMenu('.game-stats')}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <rect height="8" rx="1" width="6" x="3" y="12" />
          <rect height="12" rx="1" width="6" x="9" y="8" />
          <rect height="16" rx="1" width="6" x="15" y="4" />
          <line x1="4" x2="18" y1="20" y2="20" />
        </svg>
        <svg
          className="icon icon-tabler icon-tabler-settings"
          fill="none"
          height="24"
          stroke="#525252"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => displayMenu('.game-settings')}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>

        {/* NUEVO: Botón de Amigos 👥 */}
        <svg
          className="icon icon-tabler icon-tabler-users"
          fill="none"
          height="24"
          stroke="#1ed760"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => navigate('/amistades')}
          style={{ cursor: 'pointer' }}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <circle cx="9" cy="7" r="4" />
          <path d="M17 11v-1a4 4 0 0 0 -3 -3.85" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
          <path d="M15 19l2 2l4 -4" />
        </svg>

        {/* Icono de perfil/login */}
        <div style={{ marginLeft: 2, display: 'flex', alignItems: 'center' }}>
          {authenticated ? (
            <svg
              className="icon icon-tabler icon-tabler-user-circle"
              fill="none"
              height="24"
              stroke="#1ed760"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: 'pointer' }}
              onClick={onProfileClick}
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="10" r="3" />
              <path d="M6.5 18a6.5 6.5 0 0 1 11 0" />
            </svg>
          ) : (
            <svg
              className="icon icon-tabler icon-tabler-login"
              fill="none"
              height="24"
              stroke="#525252"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={onLoginClick}
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <path d="M10 12h10m-5 -5l5 5l-5 5" />
              <path d="M9 16v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-10a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v1" />
            </svg>
          )}
        </div>
      </div>
      {showLogin && (
        <div className="login-modal">
          {React.createElement(LoginRegister, { onLogin: () => setShowLogin(false) })}
        </div>
      )}
    </header>
  );
}

Header.defaultProps = {
  onLoginClick: undefined,
  onProfileClick: undefined,
};
