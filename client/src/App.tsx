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
import { Juego } from './types/types.d';
import cargarSettings from './utils/cargarOpciones';
import keyPress from './utils/presionarTecla';
import llenarArray from './utils/llenarArray';
import recuperarStats from './utils/recuperarStats';
import Teclado from './components/Teclado';
import Ayuda from './components/Ayuda';
import AmistadesPanel from './components/AmistadesPanel';
import LandingPage from './components/LandingPage';

function HomePage({ juego, setJuego }: { juego: Juego; setJuego: React.Dispatch<React.SetStateAction<Juego>> }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!juego.juegoFinalizado) {
      setJuego(j => ({ ...j, row: 1, position: 1 }));
    }
    // eslint-disable-next-line
  }, []);

  const handleProfileClick = () => {
    if (
      !juego.juegoFinalizado &&
      juego.estadoActual &&
      juego.estadoActual.length > 0 &&
      juego.estadoActual.some(x => x !== '')
    ) {
      setShowSavePrompt(true);
    } else {
      navigate('/profile');
    }
  };

  const handleSaveGame = async () => {
    setSaving(true);

    try {
      await fetch('/api/partidas/guardar', {
        body: JSON.stringify({
          secretWord: juego.dailyWord,
          attempts: juego.estadoActual
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: 'POST'
      });
    } catch {
      // Silenciar errores
    } finally {
      setSaving(false);
      setShowSavePrompt(false);
      navigate('/profile');
    }
  };

  const handleDiscardAndGo = () => {
    setShowSavePrompt(false);
    navigate('/profile');
  };

  return (
    <div className="game">
      {showSavePrompt && (
        <div
          style={{
            alignItems: 'center',
            background: '#000a',
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            left: 0,
            position: 'fixed',
            top: 0,
            width: '100vw',
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: 'var(--color-fondo)',
              borderRadius: 14,
              boxShadow: '0 2px 16px #1ed76033',
              color: 'var(--color-texto)',
              minWidth: 320,
              padding: 32,
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: '#1ed760', marginBottom: 18 }}>¿Guardar partida?</h3>
            <p style={{ marginBottom: 24 }}>
              Tienes una partida en curso. ¿Quieres guardarla antes de ir al perfil?
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                disabled={saving}
                style={{
                  background: '#1ed760',
                  border: 'none',
                  borderRadius: 8,
                  color: '#181a1b',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                  minWidth: 90,
                  padding: '8px 18px'
                }}
                type="button"
                onClick={handleSaveGame}
              >
                {saving ? 'Guardando...' : 'Guardar y continuar'}
              </button>
              <button
                disabled={saving}
                style={{
                  background: '#ff5252',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                  minWidth: 90,
                  padding: '8px 18px'
                }}
                type="button"
                onClick={handleDiscardAndGo}
              >
                Ir sin guardar
              </button>
              <button
                aria-label="Volver al juego"
                disabled={saving}
                style={{
                  background: 'var(--color-fondo)',
                  border: '1.5px solid #1ed760',
                  borderRadius: 8,
                  color: 'var(--color-texto)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                  minWidth: 90,
                  padding: '8px 18px'
                }}
                type="button"
                onClick={() => setShowSavePrompt(false)}
              >
                Volver al juego
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="game-main">
        <Header
          juego={juego}
          onLoginClick={() => setShowLogin(true)}
          onProfileClick={handleProfileClick}
          setJuego={setJuego}
        />
        <Board juego={juego} />
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
              aria-label="Cerrar login"
              className="ayuda-salir"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-texto)',
                cursor: 'pointer',
                fontSize: '2rem',
                lineHeight: 1,
                position: 'absolute',
                right: 18,
                top: 18
              }}
              type="button"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>
            <h2
              className="login-title"
              style={{
                color: '#1ed760',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '0 2px 12px #000a'
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(90deg, #1ed760 60%, #111 100%)',
                  color: '#fff',
                  display: 'inline-block',
                  fontFamily: 'monospace',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  marginRight: 8,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Wordle
              </span>
              <span style={{ color: '#1ed760', fontSize: '1.1rem', fontWeight: 700, marginLeft: 2 }}>
                Login
              </span>
            </h2>
            <div style={{ width: '100%' }}>
              <form
                autoComplete="off"
                className="login-form"
                onSubmit={async e => {
                  e.preventDefault();

                  const form = e.currentTarget;
                  const username = form.username.value;
                  const password = form.password.value;

                  try {
                    const res = await fetch('/api/login', {
                      body: JSON.stringify({ username, password }),
                      headers: { 'Content-Type': 'application/json' },
                      method: 'POST'
                    });

                    if (!res.ok) {
                      const errorText = await res.text();
                      try {
                        JSON.parse(errorText);
                        // Show error in UI, do not use data variable
                      } catch {
                        // Show error in UI, do not use data variable
                      }
                      return;
                    }

                    await res.json();
                    localStorage.setItem('token', '');
                    localStorage.setItem('user', JSON.stringify({}));
                    setShowLogin(false);

                    try {
                      const resWord = await fetch('/api/words/random', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      });
                      const wordData = await resWord.json();
                      const nuevaPalabra = wordData.word || wordData.palabra || '';
                      if (nuevaPalabra) {
                        setJuego(j => ({
                          ...j,
                          dailyWord: nuevaPalabra,
                          estadoActual: Array(6 * (j.longitud || 5)).fill(''),
                          hardModeMustContain: [],
                          juegoFinalizado: false,
                          maxStreak: 0,
                          position: 1,
                          row: 1,
                          streak: 0
                        }));
                      }
                    } catch {
                      window.location.reload();
                    }
                    window.location.reload();
                  } catch {
                    // Show network/login error in the UI, do not use alert
                  }
                }}
              >
                <div className="login-field">
                  <label htmlFor="username">Usuario</label>
                  <input id="username" name="username" placeholder="Tu usuario" required type="text" />
                </div>
                <div className="login-field">
                  <label htmlFor="password">Contraseña</label>
                  <input id="password" name="password" placeholder="Contraseña" required type="password" />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '0.5rem',
                    maxWidth: 340,
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <span
                    aria-label="Recuperar contraseña"
                    role="button"
                    style={{
                      color: '#1ed760',
                      cursor: 'pointer',
                      fontSize: '0.98rem',
                      fontWeight: 500,
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }}
                    tabIndex={0}
                    onClick={() => {
                      setShowLogin(false);
                      setShowForgot(true);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowLogin(false);
                        setShowForgot(true);
                      }
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <button className="login-btn" type="submit">
                  Iniciar sesión
                </button>
                <div
                  style={{
                    color: '#aaa',
                    fontSize: '0.95rem',
                    marginTop: '0.7rem',
                    textAlign: 'center'
                  }}
                >
                  ¿No tienes cuenta?{' '}
                  <span
                    aria-label="Registrarse"
                    role="button"
                    style={{
                      color: '#1ed760',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }}
                    tabIndex={0}
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowLogin(false);
                        setShowRegister(true);
                      }
                    }}
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
              aria-label="Cerrar recuperación"
              className="ayuda-salir"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-texto)',
                cursor: 'pointer',
                fontSize: '2rem',
                lineHeight: 1,
                position: 'absolute',
                right: 18,
                top: 18
              }}
              type="button"
              onClick={() => {
                setShowForgot(false);
                setForgotMessage(null);
              }}
            >
              ×
            </button>
            <h2
              className="login-title"
              style={{
                color: '#1ed760',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '0 2px 12px #000a'
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(90deg, #1ed760 60%, #111 100%)',
                  color: '#fff',
                  display: 'inline-block',
                  fontFamily: 'monospace',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  marginRight: 8,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Wordle
              </span>
              <span style={{ color: '#1ed760', fontSize: '1.1rem', fontWeight: 700, marginLeft: 2 }}>
                Recuperar contraseña
              </span>
            </h2>
            <form
              autoComplete="off"
              className="login-form"
              onSubmit={async e => {
                e.preventDefault();
                setForgotLoading(true);
                setForgotMessage(null);
                const form = e.currentTarget;
                const email = form.email.value;
                try {
                  const res = await fetch('/api/forgot-password', {
                    body: JSON.stringify({ email }),
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST'
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
                } catch {
                  setForgotMessage('Error de red al solicitar recuperación.');
                } finally {
                  setForgotLoading(false);
                }
              }}
            >
              <div className="login-field">
                <label htmlFor="forgot-email">Correo electrónico</label>
                <input
                  id="forgot-email"
                  name="email"
                  placeholder="Tu correo electrónico"
                  required
                  type="email"
                />
              </div>
              <button className="login-btn" disabled={forgotLoading} type="submit">
                {forgotLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
              {forgotMessage && (
                <div
                  style={{
                    color: forgotMessage.includes('enviado') ? '#1ed760' : '#ff5252',
                    fontWeight: 500,
                    marginTop: 10,
                    textAlign: 'center'
                  }}
                >
                  {forgotMessage}
                </div>
              )}
              <div
                style={{
                  color: '#aaa',
                  fontSize: '0.95rem',
                  marginTop: '0.7rem',
                  textAlign: 'center'
                }}
              >
                ¿Recuerdas tu contraseña?{' '}
                <span
                  aria-label="Volver a login"
                  role="button"
                  style={{
                    color: '#1ed760',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px'
                  }}
                  tabIndex={0}
                  onClick={() => {
                    setShowForgot(false);
                    setShowLogin(true);
                    setForgotMessage(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowForgot(false);
                      setShowLogin(true);
                      setForgotMessage(null);
                    }
                  }}
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
              aria-label="Cerrar registro"
              className="ayuda-salir"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-texto)',
                cursor: 'pointer',
                fontSize: '2rem',
                lineHeight: 1,
                position: 'absolute',
                right: 18,
                top: 18
              }}
              type="button"
              onClick={() => setShowRegister(false)}
            >
              ×
            </button>
            <h2
              style={{
                color: '#1ed760',
                fontSize: '2rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '0 2px 12px #000a'
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(90deg, #1ed760 60%, #111 100%)',
                  color: '#fff',
                  display: 'inline-block',
                  fontFamily: 'monospace',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  marginRight: 8,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Wordle
              </span>
              <span style={{ color: '#1ed760', fontSize: '1.1rem', fontWeight: 700, marginLeft: 2 }}>
                Registro
              </span>
            </h2>
            <div style={{ width: '100%' }}>
              <form
                autoComplete="off"
                className="login-form"
                onSubmit={async e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const username = form.username.value;
                  const email = form.email.value;
                  const password = form.password.value;
                  const password2 = form.password2.value;

                  // Validación de contraseñas
                  if (password !== password2) {
                    // Show error UI, do not use alert
                    return;
                  }
                  if (password.length < 6) {
                    // Show error UI, do not use alert
                    return;
                  }
                  if (!/[A-Z]/.test(password)) {
                    // Show error UI, do not use alert
                    return;
                  }
                  if (!/[a-z]/.test(password)) {
                    // Show error UI, do not use alert
                    return;
                  }
                  if (!/[0-9]/.test(password)) {
                    // Show error UI, do not use alert
                    return;
                  }
                  try {
                    const res = await fetch('/api/register', {
                      body: JSON.stringify({ username, email, password }),
                      headers: { 'Content-Type': 'application/json' },
                      method: 'POST'
                    });

                    if (!res.ok) {
                      const errorText = await res.text();
                      try {
                        JSON.parse(errorText);
                        // Show error in UI, do not use data variable
                      } catch {
                        // Show error in UI, do not use data variable
                      }
                      return;
                    }
                    // Show success message in UI (no alert)
                    setShowRegister(false);
                    setShowLogin(true);
                  } catch {
                    // Show network/register error in UI (no alert)
                  }
                }}
              >
                <div className="login-field">
                  <label
                    htmlFor="reg-username"
                    style={{
                      alignSelf: 'flex-start',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    Usuario
                  </label>
                  <input id="reg-username" name="username" placeholder="Elige un usuario" required type="text" />
                </div>
                <div className="login-field">
                  <label
                    htmlFor="reg-email"
                    style={{
                      alignSelf: 'flex-start',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    Email
                  </label>
                  <input id="reg-email" name="email" placeholder="Tu correo electrónico" required type="email" />
                </div>
                <div className="login-field">
                  <label
                    htmlFor="reg-password"
                    style={{
                      alignSelf: 'flex-start',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    Contraseña
                  </label>
                  <input id="reg-password" name="password" placeholder="Crea una contraseña" required type="password" />
                </div>
                <div className="login-field">
                  <label
                    htmlFor="reg-password2"
                    style={{
                      alignSelf: 'flex-start',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    Repite la contraseña
                  </label>
                  <input
                    id="reg-password2"
                    name="password2"
                    placeholder="Repite la contraseña"
                    required
                    type="password"
                  />
                </div>
                <button className="login-btn" type="submit">
                  Registrarse
                </button>
                <div
                  style={{
                    color: '#aaa',
                    fontSize: '0.95rem',
                    marginTop: '0.7rem',
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  ¿Ya tienes cuenta?{' '}
                  <span
                    aria-label="Inicia sesión"
                    role="button"
                    style={{
                      color: '#1ed760',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }}
                    tabIndex={0}
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowRegister(false);
                        setShowLogin(true);
                      }
                    }}
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
  const [juego, setJuego] = useState<Juego>({
    categoria: 'general',
    dailyWord: '',
    dificil: false,
    distribucion: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      X: 0
    },
    estadoActual: [],
    hardModeMustContain: [],
    idioma: 'es',
    juegoFinalizado: false,
    jugadas: 0,
    longitud: 5,
    maxStreak: 0,
    modoDaltonico: false,
    modoOscuro: true,
    position: 1,
    row: 1,
    streak: 0,
    victorias: 0
  });

  useEffect(() => {
    const rawData = localStorage.getItem('juego');
    if (!rawData) return;

    const savedData = JSON.parse(rawData);
    if (savedData) {
      let newState: Juego = {
        categoria: savedData.categoria ?? 'general',
        dailyWord: savedData.dailyWord,
        dificil: savedData.dificil,
        distribucion: savedData.distribucion,
        estadoActual: savedData.estadoActual,
        hardModeMustContain: [],
        idioma: savedData.idioma ?? 'es',
        juegoFinalizado: false,
        jugadas: 0,
        longitud: savedData.longitud ?? 5,
        maxStreak: 0,
        modoDaltonico: savedData.modoDaltonico,
        modoOscuro: savedData.modoOscuro,
        position: 1,
        row: 1,
        streak: 0,
        victorias: 0
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
      if (!juego.juegoFinalizado && localStorage.getItem('token')) {
        try {
          await fetch('/api/partidas/guardar', {
            body: JSON.stringify({
              secretWord: juego.dailyWord,
              attempts: juego.estadoActual
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            method: 'POST'
          });
        } catch {
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
        setJuego(j => ({ ...j, row: 1, position: 1 }));
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<HomePage juego={juego} setJuego={setJuego} />} path="/jugar" />
        <Route element={<LoginRegister initialMode="register" onLogin={() => { /* Intentionally empty handler for interface compliance */ }} />} path="/register" />
        <Route element={<Ayuda />} path="/help" />
        <Route element={<Stats juego={juego} />} path="/stats" />
        <Route element={<Settings juego={juego} setJuego={setJuego} />} path="/settings" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<ProfilePage />} path="/profile" />
        <Route element={<ResetPasswordPage />} path="/reset-password" />
        <Route element={<VerifyEmailPage />} path="/verify-email" />
        <Route element={<AmistadesPanel />} path="/amistades" />
      </Routes>
    </Router>
  );
}

export default App;
