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

  const [profileImage, setProfileImage] = useState<string | null>(null);

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
    const body: Record<string, unknown> = { ...form };
    if (!isLogin && profileImage) body.profileImage = profileImage;

    try {
      const res = await fetch(`${process.env.PUBLIC_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
          setProfileImage(null);
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

          {!isLogin && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <label style={{ color: '#fff', fontWeight: 600, fontSize: '0.97rem' }}>Foto de perfil (opcional):</label>
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }}
      style={{ color: '#fff', fontSize: '0.97rem' }}
    />
    <img
  src={
    profileImage ||
    "https://ui-avatars.com/api/?name=User&background=1ed760&color=181a1b&rounded=true"
  }
  alt="preview"
  style={{
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #1ed760',
    background: '#fff'
  }}
    />
  </div>
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
            disabled={loading}
            onBlur={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
            type="submit"
          >
            {loading ? 'Enviando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '1rem', color: messageColor, fontSize: '0.95rem' }}>{message}</p>
        )}

        <button
          type="button"
          style={{
            marginTop: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#1ed760',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline',
          }}
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
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
