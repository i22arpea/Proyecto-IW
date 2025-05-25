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
import Ranking from './Ranking';
import { guardarPartida } from '../utils/gamePersistence';
import AgregarAmigo from './AgregarAmigo';

// eslint-disable-next-line
export interface HeaderProps {
  juego: Juego;
  setJuego: React.Dispatch<React.SetStateAction<Juego>>;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
}

export default function Header({ juego, setJuego, onLoginClick = undefined, onProfileClick = undefined }: HeaderProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const authenticated = isAuthenticated();
  const navigate = useNavigate();

  // Implementación por defecto para onProfileClick
  const handleProfileClick = onProfileClick || (() => navigate('/profile'));

  // Handler para botones protegidos
  function requireLogin(action: () => void) {
    if (!authenticated) {
      alert('Debes iniciar sesión para acceder a esta funcionalidad.');
      return;
    }
    action();
  }

  return (
    <header className="header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem 1.5rem',background:'#181a1b',borderRadius:16,boxShadow:'0 2px 12px #1ed76022',margin:'1.5rem auto 2.5rem',maxWidth:700}}>
      <div style={{display:'flex',alignItems:'center',gap:12,minWidth:140}}>
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
          style={{cursor:'pointer'}}
        >
          <title>Ayuda</title>
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
          onClick={() => requireLogin(() => {
            const nuevaPalabra = words[Math.floor(Math.random() * words.length)];
            const newState = {
              ...restartGame(juego),
              dailyWord: encriptarPalabra(nuevaPalabra)
            };
            llenarArray(newState);
            setJuego(newState);
          })}
          style={{cursor:'pointer'}}
        >
          <title>Reiniciar</title>
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
        <svg
          className="icon icon-tabler icon-tabler-download"
          fill="none"
          height="24"
          stroke="#1ed760"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          style={{cursor:'pointer'}}
          onClick={() => {
            guardarPartida(juego);
            alert('¡Partida guardada! Puedes recuperarla al volver a entrar.');
          }}
          aria-label="Guardar partida"
        >
          <title>Guardar partida</title>
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
          <rect x="4" y="17" width="16" height="2" rx="1" />
        </svg>
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
          onClick={() => setShowRanking(true)}
          style={{cursor:'pointer'}}
        >
          <title>Ranking</title>
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
          onClick={() => requireLogin(() => displayMenu('.game-settings'))}
          style={{cursor:'pointer'}}
        >
          <title>Opciones</title>
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <h1 className="titulo" style={{
        margin: '0 32px', // Espacio lateral
        fontSize: '1.6rem',
        fontWeight: 900,
        letterSpacing: '0.01em',
        color: '#1ed760',
        textShadow: '0 2px 12px #000a',
        textAlign: 'center',
        flex: 1,
        minWidth: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>Wordle</h1>
      <div style={{display:'flex',alignItems:'center',gap:12,minWidth:140,justifyContent:'flex-end'}}>
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
        {authenticated ? (
          <button
            type="button"
            onClick={handleProfileClick}
            style={{background:'#1ed760',color:'#181a1b',border:'none',borderRadius:8,padding:'7px 18px',fontWeight:700,fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px #1ed76033'}}>
            Perfil
          </button>
        ) : (
          <button
            type="button"
            onClick={onLoginClick || (() => setShowLogin(true))}
            style={{background:'#1ed760',color:'#181a1b',border:'none',borderRadius:8,padding:'7px 18px',fontWeight:700,fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px #1ed76033'}}>
            Iniciar sesión
          </button>
        )}
      </div>
      {showRanking && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#000a',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Ranking onClose={() => setShowRanking(false)} />
        </div>
      )}
      {showLogin && (
        <div className="login-modal">
          {React.createElement(LoginRegister, { onLogin: () => setShowLogin(false) })}
        </div>
      )}
      {showAddFriend && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#000a',zIndex:1100,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#181a1b',padding:32,borderRadius:16,boxShadow:'0 2px 16px #1ed76033',minWidth:320,position:'relative'}}>
            <button
              type="button"
              onClick={() => setShowAddFriend(false)}
              style={{position:'absolute',top:10,right:14,background:'none',border:'none',color:'#aaa',fontSize:'1.5rem',cursor:'pointer'}}
              aria-label="Cerrar"
            >×</button>
            <h3 style={{color:'#1ed760',marginBottom:18}}>Añadir amigo</h3>
            <AgregarAmigo />
          </div>
        </div>
      )}
    </header>
  );
}

Header.defaultProps = {
  onLoginClick: undefined,
  onProfileClick: undefined,
};
