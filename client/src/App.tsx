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
import { setupBeforeUnload, preguntarRestaurarPartida } from './utils/gamePersistence';

function HomePage({ juego, setJuego }: { juego: Juego; setJuego: React.Dispatch<React.SetStateAction<Juego>> }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string|null>(null);
  const navigate = useNavigate();

  return (
    <div className="game">
      <div className="game-main">
        <Header juego={juego} setJuego={setJuego} onLoginClick={() => setShowLogin(true)} onProfileClick={() => navigate('/profile')} />
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
      {showLogin && (
        <div className="game-login-overlay">
          <div className="game-login-form-container">
            <button
              className="ayuda-salir"
              type="button"
              style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: 'var(--color-texto)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
              onClick={() => setShowLogin(false)}
              aria-label="Cerrar login"
            >
              ×
            </button>
            <h2 className="login-title" style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', fontSize: '2rem', color: '#1ed760', textShadow: '0 2px 12px #000a' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '2.2rem',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #1ed760 60%, #111 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  marginRight: 8
                }}
              >
                Wordle
              </span>
              <span style={{ fontSize: '1.1rem', color: '#1ed760', fontWeight: 700, marginLeft: 2 }}>Login</span>
            </h2>
            <div style={{ width: '100%' }}>
              <form
                className="login-form"
                autoComplete="off"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const username = form.username.value;
                  const password = form.password.value;
                  try {
                    const res = await fetch('/api/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username, password })
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      try {
                        const data = JSON.parse(errorText);
                        console.error('Login error:', data);
                        alert(data.message || data.error || 'Error al iniciar sesión');
                      } catch (parseErr) {
                        console.error('Login error (raw):', errorText);
                        alert(`Error al iniciar sesión: ${errorText}`);
                      }
                      return;
                    }
                    const data = await res.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setShowLogin(false);
                    window.location.reload(); // Opcional: recarga para reflejar login
                  } catch (err) {
                    console.error('Network/login error:', err);
                    alert('Error de red al iniciar sesión');
                  }
                }}
              >
                <div className="login-field">
                  <label htmlFor="username">Usuario</label>
                  <input id="username" name="username" type="text" placeholder="Tu usuario" required />
                </div>
                <div className="login-field">
                  <label htmlFor="password">Contraseña</label>
                  <input id="password" name="password" type="password" placeholder="Contraseña" required />
                </div>
                <div style={{ width: '100%', maxWidth: 340, textAlign: 'left', marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                  <span
                    style={{ color: '#1ed760', fontWeight: 500, fontSize: '0.98rem', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => { setShowLogin(false); setShowForgot(true); }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowLogin(false); setShowForgot(true); } }}
                    aria-label="Recuperar contraseña"
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <button className="login-btn" type="submit">
                  Iniciar sesión
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.7rem', color: '#aaa', fontSize: '0.95rem' }}>
                  ¿No tienes cuenta? <span
                    style={{ color: '#1ed760', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => { setShowLogin(false); setShowRegister(true); }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowLogin(false); setShowRegister(true); } }}
                    aria-label="Registrarse"
                  >
                    Regístrate
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showForgot && (
        <div className="game-login-overlay">
          <div className="game-login-form-container">
            <button
              className="ayuda-salir"
              type="button"
              style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: 'var(--color-texto)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
              onClick={() => { setShowForgot(false); setForgotMessage(null); }}
              aria-label="Cerrar recuperación"
            >
              ×
            </button>
            <h2 className="login-title" style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', fontSize: '2rem', color: '#1ed760', textShadow: '0 2px 12px #000a' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '2.2rem',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #1ed760 60%, #111 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  marginRight: 8
                }}
              >
                Wordle
              </span>
              <span style={{ fontSize: '1.1rem', color: '#1ed760', fontWeight: 700, marginLeft: 2 }}>Recuperar contraseña</span>
            </h2>
            <form
              className="login-form"
              autoComplete="off"
              onSubmit={async (e) => {
                e.preventDefault();
                setForgotLoading(true);
                setForgotMessage(null);
                const form = e.currentTarget;
                const email = form.email.value;
                try {
                  const res = await fetch('/api/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  });
                  if (!res.ok) {
                    const errorText = await res.text();
                    try {
                      const data = JSON.parse(errorText);
                      setForgotMessage(data.message || data.error || 'Error al solicitar recuperación.');
                    } catch {
                      setForgotMessage(`Error al solicitar recuperación: ${errorText}`);
                    }
                  } else {
                    setForgotMessage('Si el correo existe, se ha enviado un enlace de recuperación.');
                  }
                } catch (err) {
                  setForgotMessage('Error de red al solicitar recuperación.');
                } finally {
                  setForgotLoading(false);
                }
              }}
            >
              <div className="login-field">
                <label htmlFor="forgot-email">Correo electrónico</label>
                <input id="forgot-email" name="email" type="email" placeholder="Tu correo electrónico" required />
              </div>
              <button className="login-btn" type="submit" disabled={forgotLoading}>
                {forgotLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
              {forgotMessage && (
                <div style={{ color: forgotMessage.includes('enviado') ? '#1ed760' : '#ff5252', marginTop: 10, textAlign: 'center', fontWeight: 500 }}>
                  {forgotMessage}
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: '0.7rem', color: '#aaa', fontSize: '0.95rem' }}>
                ¿Recuerdas tu contraseña?{' '}
                <span
                  style={{ color: '#1ed760', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                  role="button"
                  tabIndex={0}
                  onClick={() => { setShowForgot(false); setShowLogin(true); setForgotMessage(null); }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowForgot(false); setShowLogin(true); setForgotMessage(null); } }}
                  aria-label="Volver a login"
                >
                  Inicia sesión
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
      {showRegister && (
        <div className="game-login-overlay">
          <div className="game-login-form-container">
            <button
              className="ayuda-salir"
              type="button"
              style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: 'var(--color-texto)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
              onClick={() => setShowRegister(false)}
              aria-label="Cerrar registro"
            >
              ×
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', fontSize: '2rem', color: '#1ed760', textShadow: '0 2px 12px #000a' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '2.2rem', color: '#fff', background: 'linear-gradient(90deg, #1ed760 60%, #111 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', marginRight: 8 }}>Wordle</span>
              <span style={{ fontSize: '1.1rem', color: '#1ed760', fontWeight: 700, marginLeft: 2 }}>Registro</span>
            </h2>
            <div style={{ width: '100%' }}>
              <form
                className="login-form"
                autoComplete="off"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const username = form.username.value;
                  const email = form.email.value;
                  const password = form.password.value;
                  const password2 = form.password2.value;
                  // Validación de contraseñas
                  if (password !== password2) {
                    alert('Las contraseñas no coinciden');
                    return;
                  }
                  if (password.length < 6) {
                    alert('La contraseña debe tener al menos 6 caracteres.');
                    return;
                  }
                  if (!/[A-Z]/.test(password)) {
                    alert('La contraseña debe contener al menos una letra mayúscula.');
                    return;
                  }
                  if (!/[a-z]/.test(password)) {
                    alert('La contraseña debe contener al menos una letra minúscula.');
                    return;
                  }
                  if (!/[0-9]/.test(password)) {
                    alert('La contraseña debe contener al menos un número.');
                    return;
                  }
                  try {
                    const res = await fetch('/api/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username, email, password })
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      try {
                        const data = JSON.parse(errorText);
                        console.error('Register error:', data);
                        alert(data.message || data.error || 'Error al registrarse');
                      } catch (parseErr) {
                        console.error('Register error (raw):', errorText);
                        alert(`Error al registrarse: ${errorText}`);
                      }
                      return;
                    }
                    alert('Registro exitoso. Ahora puedes iniciar sesión.');
                    setShowRegister(false);
                    setShowLogin(true);
                  } catch (err) {
                    console.error('Network/register error:', err);
                    alert('Error de red al registrarse');
                  }
                }}
              >
                <div className="login-field">
                  <label htmlFor="reg-username" style={{ fontWeight: 600, color: '#fff', alignSelf: 'flex-start' }}>Usuario</label>
                  <input id="reg-username" name="username" type="text" placeholder="Elige un usuario" required />
                </div>
                <div className="login-field">
                  <label htmlFor="reg-email" style={{ fontWeight: 600, color: '#fff', alignSelf: 'flex-start' }}>Email</label>
                  <input id="reg-email" name="email" type="email" placeholder="Tu correo electrónico" required />
                </div>
                <div className="login-field">
                  <label htmlFor="reg-password" style={{ fontWeight: 600, color: '#fff', alignSelf: 'flex-start' }}>Contraseña</label>
                  <input id="reg-password" name="password" type="password" placeholder="Crea una contraseña" required />
                </div>
                <div className="login-field">
                  <label htmlFor="reg-password2" style={{ fontWeight: 600, color: '#fff', alignSelf: 'flex-start' }}>Repite la contraseña</label>
                  <input id="reg-password2" name="password2" type="password" placeholder="Repite la contraseña" required />
                </div>
                <button className="login-btn" type="submit">
                  Registrarse
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.7rem', color: '#aaa', fontSize: '0.95rem', width: '100%' }}>
                  ¿Ya tienes cuenta? <span
                    style={{ color: '#1ed760', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => { setShowRegister(false); setShowLogin(true); }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowRegister(false); setShowLogin(true); } }}
                    aria-label="Inicia sesión"
                  >
                    Inicia sesión
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer limit={3} />
    </div>
  );
}

function App() {
  // --- Restaurar partida guardada si existe ---
  const partidaGuardada = preguntarRestaurarPartida();
  const [juego, setJuego] = useState<Juego>(
    partidaGuardada || {
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
    }
  );

  // Interceptar recarga/cierre para preguntar si guardar
  useEffect(() => {
    setupBeforeUnload(juego);
    return () => {
      window.onbeforeunload = null;
    };
  }, [juego]);

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

  useEffect(() => {
    const handleAutoSave = async () => {
      // Solo guardar si la partida no está finalizada
      if (!juego.juegoFinalizado && localStorage.getItem('token')) {
        try {
          await fetch('/api/partidas/guardar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              secretWord: juego.dailyWord,
              attempts: juego.estadoActual
            })
          });
        } catch (err) {
          // Silenciar errores de guardado automático
        }
      }
    };
    window.addEventListener('beforeunload', handleAutoSave);
    return () => window.removeEventListener('beforeunload', handleAutoSave);
  }, [juego]);

  useEffect(() => {
    // --- CORRECCIÓN: Siempre empezar en la primera fila editable si está vacía ---
    const squares = document.getElementsByClassName('square');
    if (squares.length >= 5) {
      let allEmpty = true;
      for (let i = 0; i < 5; i++) {
        if (squares[i].textContent && squares[i].textContent !== '') {
          allEmpty = false;
          break;
        }
      }
      if (allEmpty) {
        // Si la primera fila está vacía, forzar posición y fila al inicio
        setJuego(j => ({ ...j, row: 1, position: 1 }));
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jugar" element={<HomePage juego={juego} setJuego={setJuego} />} />
        <Route path="/register" element={<LoginRegister initialMode="register" onLogin={() => console.log('Registrado')} />} />
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
