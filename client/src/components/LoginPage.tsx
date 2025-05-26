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
      const response = await fetch(`${process.env.PUBLIC_URL}/api/login`, {
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
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
        onSubmit={handleLogin}
      >
        <h2 style={{ color: '#1ed760', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>

        <input
          className="login-input"
          style={{
            background: '#23272f',
            border: '1px solid #1ed760',
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '1rem',
            padding: '10px',
            width: '100%',
          }}
          type="text"
          placeholder="Usuario"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          style={{
            background: '#23272f',
            border: '1px solid #1ed760',
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '1rem',
            padding: '10px',
            width: '100%',
          }}
          type="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div
            className="error"
            style={{
              color: '#ff5252',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <button
          className="login-button"
          style={{
            backgroundColor: isHovered ? '#16b34a' : '#1ed760',
            border: 'none',
            borderRadius: '8px',
            color: '#181a1b',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '10px 20px',
            transition: 'background 0.3s',
          }}
          type="submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
