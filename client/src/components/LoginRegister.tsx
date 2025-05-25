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

  // Color del mensaje sin ternarios anidados
  let messageColor = 'tomato';
  if (message) {
    const lower = message.toLowerCase();
    if (lower.includes('exitoso') || lower.includes('enviado')) {
      messageColor = 'limegreen';
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      {children}
      <h2>{isLogin ? 'Iniciar sesión' : 'Registro'}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {!isLogin && (
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        )}

        <input
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem', color: messageColor }}>
          {message}
        </p>
      )}

      <button
        type="button"
        style={{ marginTop: '1rem', cursor: 'pointer' }}
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage(null);
        }}
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

LoginRegister.defaultProps = {
  children: undefined,
  initialMode: 'login' as const,
};

export default LoginRegister;
