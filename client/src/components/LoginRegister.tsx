import React, { useState, useEffect } from 'react';

interface LoginRegisterProps {
  onLogin: () => void;
  children?: React.ReactNode;
  initialMode?: 'login' | 'register';
}

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const LoginRegister = function LoginRegister({ onLogin, children, initialMode }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (initialMode === 'register') {
      setIsLogin(false);
    }
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await fetch(`${API}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setMessage('Inicio de sesión exitoso');
          onLogin();
        } else {
          setMessage(data.message || 'Registro exitoso. Revisa tu correo para verificar la cuenta.');
          setForm({ username: '', email: '', password: '' });
        }
      } else {
        setMessage(data.error || data.message || 'Error al procesar la solicitud');
      }
    } catch (err) {
      setMessage('Error de red al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  let messageColor = 'tomato';
  if (message) {
    const lower = message.toLowerCase();
    if (lower.includes('exitoso') || lower.includes('enviado')) {
      messageColor = '#1ed760';
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#181a1b',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(30, 215, 96, 0.3)',
          width: '100%',
          maxWidth: '360px',
          textAlign: 'center',
        }}
      >
        {children}
        <h2 style={{ color: '#1ed760', marginBottom: '1.5rem' }}>
          {isLogin ? 'Iniciar sesión' : 'Registro'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            placeholder="Usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #1ed760',
              background: '#23272f',
              color: '#fff',
              borderRadius: '8px',
            }}
          />

          {!isLogin && (
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #1ed760',
                background: '#23272f',
                color: '#fff',
                borderRadius: '8px',
              }}
            />
          )}

          <input
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #1ed760',
              background: '#23272f',
              color: '#fff',
              borderRadius: '8px',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            style={{
              backgroundColor: hovered ? '#16b34a' : '#1ed760',
              color: '#181a1b',
              border: 'none',
              padding: '10px 20px',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {loading ? 'Enviando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '1rem', color: messageColor, fontSize: '0.95rem' }}>{message}</p>
        )}

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }}
          style={{
            marginTop: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#1ed760',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline',
          }}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

LoginRegister.defaultProps = {
  children: undefined,
  initialMode: 'login' as const,
};

export default LoginRegister;
