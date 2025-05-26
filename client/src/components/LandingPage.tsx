import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          color: '#1ed760',
          marginBottom: '2rem',
          textShadow: '0 0 10px #1ed76088',
        }}
      >
        Bienvenido a Wordle 2.0
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: 300,
        }}
      >
        <button
          type="button"
          style={botonEstilo}
          onClick={() => setShowRegister(true)}
        >
          Registrarse
        </button>
        <button
          type="button"
          style={botonEstilo}
          onClick={() => setShowLogin(true)}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          style={{
            ...botonEstilo,
            backgroundColor: '#1ed760',
            color: '#000',
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/jugar')}
        >
          Jugar partida
        </button>
      </div>
      {showLogin && (
        <div className="game-login-overlay">
          <div className="game-login-form-container">
            <button
              className="ayuda-salir"
              type="button"
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'none',
                border: 'none',
                color: 'var(--color-texto)',
                fontSize: '2rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              onClick={() => setShowLogin(false)}
              aria-label="Cerrar login"
            >
              ×
            </button>
            <h2
              className="login-title"
              style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '2rem',
                color: '#1ed760',
                textShadow: '0 2px 12px #000a',
              }}
            >
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
                  marginRight: 8,
                }}
              >
                Wordle
              </span>
              <span
                style={{
                  fontSize: '1.1rem',
                  color: '#1ed760',
                  fontWeight: 700,
                  marginLeft: 2,
                }}
              >
                Login
              </span>
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
                      body: JSON.stringify({ username, password }),
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      try {
                        const data = JSON.parse(errorText);
                        alert(data.message || data.error || 'Error al iniciar sesión');
                      } catch (parseErr) {
                        alert(`Error al iniciar sesión: ${errorText}`);
                      }
                      return;
                    }
                    const data = await res.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setShowLogin(false);
                    window.location.reload();
                  } catch (err) {
                    alert('Error de red al iniciar sesión');
                  }
                }}
              >
                <div className="login-field">
                  <label htmlFor="username">Usuario</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Tu usuario"
                    required
                  />
                </div>
                <div className="login-field">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    required
                  />
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 340,
                    textAlign: 'left',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      color: '#1ed760',
                      fontWeight: 500,
                      fontSize: '0.98rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setShowLogin(false);
                      setShowForgot(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowLogin(false);
                        setShowForgot(true);
                      }
                    }}
                    aria-label="Recuperar contraseña"
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <button className="login-btn" type="submit">
                  Iniciar sesión
                </button>
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '0.7rem',
                    color: '#aaa',
                    fontSize: '0.95rem',
                  }}
                >
                  ¿No tienes cuenta?{' '}
                  <span
                    style={{
                      color: '#1ed760',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowLogin(false);
                        setShowRegister(true);
                      }
                    }}
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
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'none',
                border: 'none',
                color: 'var(--color-texto)',
                fontSize: '2rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              onClick={() => {
                setShowForgot(false);
                setForgotMessage(null);
              }}
              aria-label="Cerrar recuperación"
            >
              ×
            </button>
            <h2
              className="login-title"
              style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '2rem',
                color: '#1ed760',
                textShadow: '0 2px 12px #000a',
              }}
            >
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
                  marginRight: 8,
                }}
              >
                Wordle
              </span>
              <span
                style={{
                  fontSize: '1.1rem',
                  color: '#1ed760',
                  fontWeight: 700,
                  marginLeft: 2,
                }}
              >
                Recuperar contraseña
              </span>
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
                    body: JSON.stringify({ email }),
                  });
                  if (!res.ok) {
                    const errorText = await res.text();
                    try {
                      const data = JSON.parse(errorText);
                      setForgotMessage(
                        data.message || data.error || 'Error al solicitar recuperación.'
                      );
                    } catch {
                      setForgotMessage(`Error al solicitar recuperación: ${errorText}`);
                    }
                  } else {
                    setForgotMessage(
                      'Si el correo existe, se ha enviado un enlace de recuperación.'
                    );
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
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  required
                />
              </div>
              <button className="login-btn" type="submit" disabled={forgotLoading}>
                {forgotLoading
                  ? 'Enviando...'
                  : 'Enviar enlace de recuperación'}
              </button>
              {forgotMessage && (
                <div
                  style={{
                    color: forgotMessage.includes('enviado')
                      ? '#1ed760'
                      : '#ff5252',
                    marginTop: 10,
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  {forgotMessage}
                </div>
              )}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '0.7rem',
                  color: '#aaa',
                  fontSize: '0.95rem',
                }}
              >
                ¿Recuerdas tu contraseña?{' '}
                <span
                  style={{
                    color: '#1ed760',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setShowForgot(false);
                    setShowLogin(true);
                    setForgotMessage(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowForgot(false);
                      setShowLogin(true);
                      setForgotMessage(null);
                    }
                  }}
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
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'none',
                border: 'none',
                color: 'var(--color-texto)',
                fontSize: '2rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              onClick={() => setShowRegister(false)}
              aria-label="Cerrar registro"
            >
              ×
            </button>
            <h2
              style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '2rem',
                color: '#1ed760',
                textShadow: '0 2px 12px #000a',
              }}
            >
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
                  marginRight: 8,
                }}
              >
                Wordle
              </span>
              <span
                style={{
                  fontSize: '1.1rem',
                  color: '#1ed760',
                  fontWeight: 700,
                  marginLeft: 2,
                }}
              >
                Registro
              </span>
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
                      body: JSON.stringify({ username, email, password }),
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      try {
                        const data = JSON.parse(errorText);
                        alert(data.message || data.error || 'Error al registrarse');
                      } catch (parseErr) {
                        alert(`Error al registrarse: ${errorText}`);
                      }
                      return;
                    }
                    alert('Registro exitoso. Ahora puedes iniciar sesión.');
                    setShowRegister(false);
                    setShowLogin(true);
                  } catch (err) {
                    alert('Error de red al registrarse');
                  }
                }}
              >
                <div className="login-field">
                  <label
                    htmlFor="reg-username"
                    style={{
                      fontWeight: 600,
                      color: '#fff',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Usuario
                  </label>
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    placeholder="Elige un usuario"
                    required
                  />
                </div>
                <div className="login-field">
                  <label
                    htmlFor="reg-email"
                    style={{
                      fontWeight: 600,
                      color: '#fff',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="Tu correo electrónico"
                    required
                  />
                </div>
                <div className="login-field">
                  <label
                    htmlFor="reg-password"
                    style={{
                      fontWeight: 600,
                      color: '#fff',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Contraseña
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder="Crea una contraseña"
                    required
                  />
                </div>
                <div className="login-field">
                  <label
                    htmlFor="reg-password2"
                    style={{
                      fontWeight: 600,
                      color: '#fff',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Repite la contraseña
                  </label>
                  <input
                    id="reg-password2"
                    name="password2"
                    type="password"
                    placeholder="Repite la contraseña"
                    required
                  />
                </div>
                <button className="login-btn" type="submit">
                  Registrarse
                </button>
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '0.7rem',
                    color: '#aaa',
                    fontSize: '0.95rem',
                    width: '100%',
                  }}
                >
                  ¿Ya tienes cuenta?{' '}
                  <span
                    style={{
                      color: '#1ed760',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowRegister(false);
                        setShowLogin(true);
                      }
                    }}
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
    </div>
  );
}

const botonEstilo: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: '1.1rem',
  borderRadius: '8px',
  backgroundColor: '#333',
  color: '#fff',
  border: '1px solid #555',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};
