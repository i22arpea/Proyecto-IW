import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Board from './components/Tablero';
import Header from './components/Header';
import Settings from './components/Opciones';
import Stats from './components/Stats';
import LoginRegister from './components/LoginRegister';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import ResetPasswordPage from './components/ResetPasswordPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import { encriptarPalabra } from './libs/crypto';
import { Juego } from './types/types.d';
import cargarSettings from './utils/cargarOpciones';
import keyPress from './utils/presionarTecla';
import llenarArray from './utils/llenarArray';
import recuperarStats from './utils/recuperarStats';
import words from './json/palabras_5.json';
import Teclado from './components/Teclado';
import Ayuda from './components/Ayuda';
import AmistadesPanel from './components/AmistadesPanel';
import LandingPage from './components/LandingPage';

function HomePage({ juego, setJuego }: { juego: Juego; setJuego: React.Dispatch<React.SetStateAction<Juego>> }) {
  return (
    <div className="game">
      <div className="game-main">
        <Header juego={juego} setJuego={setJuego} />
        <Board />
        <Teclado juego={juego} setJuego={setJuego} />
      </div>
      <div className="game-help hidden scale-up-center">
        <Ayuda />
      </div>
      <div className="game-stats hidden scale-up-center">
        <Stats juego={juego} />
      </div>
      <div className="game-settings hidden scale-up-center">
        <Settings juego={juego} setJuego={setJuego} />
      </div>
      <ToastContainer limit={3} />
    </div>
  );
}

function App() {
  const [juego, setJuego] = useState<Juego>({
    position: 1,
    row: 1,
    dificil: false,
    modoOscuro: true,
    modoDaltonico: false,
    dailyWord: encriptarPalabra(words[Math.floor(Math.random() * words.length)]),
    juegoFinalizado: false,
    jugadas: 0,
    victorias: 0,
    distribucion: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      X: 0,
    },
    estadoActual: [],
    streak: 0,
    maxStreak: 0,
    hardModeMustContain: [],
  });

  useEffect(() => {
    const rawData = localStorage.getItem('juego');
    if (!rawData) return;
    const savedData = JSON.parse(rawData);
    if (savedData) {
      let newState: Juego = {
        dificil: savedData.dificil,
        modoOscuro: savedData.modoOscuro,
        modoDaltonico: savedData.modoDaltonico,
        dailyWord: savedData.dailyWord,
        distribucion: savedData.distribucion,
        estadoActual: savedData.estadoActual,
        jugadas: 0,
        victorias: 0,
        juegoFinalizado: false,
        row: 1,
        position: 1,
        streak: 0,
        maxStreak: 0,
        hardModeMustContain: [],
      };

      if (savedData.estadoActual[0] && savedData.estadoActual[0] !== '') {
        for (let i = 0; i < savedData.estadoActual.length; i++) {
          if (savedData.estadoActual[i] !== '') {
            newState = keyPress(savedData.estadoActual[i], newState);
            if ((i + 1) % 5 === 0) {
              newState = llenarArray(newState);
              newState = keyPress('Enter', newState);
            }
          }
        }
      }
      newState = recuperarStats(newState);
      setJuego(newState);
    }
  }, []);

  useEffect(() => {
    function listenKeydown(e: KeyboardEvent) {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      let newState = keyPress(e.key, juego);
      if (e.key === 'Enter') newState = llenarArray(newState);
      setJuego(newState);
    }
    document.addEventListener('keydown', listenKeydown);
    cargarSettings(juego);
    return () => document.removeEventListener('keydown', listenKeydown);
  }, [juego]);

  useEffect(() => {
    localStorage.setItem('juego', JSON.stringify(juego));
  }, [juego]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jugar" element={<HomePage juego={juego} setJuego={setJuego} />} />
        <Route path="/register" element={<LoginRegister onLogin={() => {}} />} />
        <Route path="/help" element={<Ayuda />} />
        <Route path="/stats" element={<Stats juego={juego} />} />
        <Route path="/settings" element={<Settings juego={juego} setJuego={setJuego} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/amistades" element={<AmistadesPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
