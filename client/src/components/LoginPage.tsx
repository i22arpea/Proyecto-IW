import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false); // nuevo estado para hover

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        const data = await response.json();
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        className="login-form"
        onSubmit={handleLogin}
        style={{
          background: '#181a1b',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(30, 215, 96, 0.3)',
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 style={{ color: '#1ed760', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>

        <input
          autoComplete="username"
          className="login-input"
          placeholder="Usuario"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '1rem',
            border: '1px solid #1ed760',
            background: '#23272f',
            color: '#fff',
            borderRadius: '8px',
          }}
        />

        <input
          autoComplete="current-password"
          className="login-input"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '1rem',
            border: '1px solid #1ed760',
            background: '#23272f',
            color: '#fff',
            borderRadius: '8px',
          }}
        />

        {error && (
          <div
            className="error"
            style={{
              color: '#ff5252',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <button
          className="login-button"
          type="submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          style={{
            backgroundColor: isHovered ? '#16b34a' : '#1ed760',
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
          Entrar
        </button>
      </form>
    </div>
  );
}
