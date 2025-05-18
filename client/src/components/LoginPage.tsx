import React, { useState } from 'react';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Aquí puedes cambiar la URL por la de tu backend
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, correo, password }),
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
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        <input
          name="username"
          autoComplete="username"
          className="login-input"
          placeholder="Usuario"
          required
          type="text"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />

        <input
          name="email"
          autoComplete="email"
          className="login-input"
          placeholder="Correo"
          required
          type="email"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
        />

        <input
          name="password"
          autoComplete="current-password"
          className="login-input"
          placeholder="Contraseña"
          required
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button
          className="login-button"
          type="submit"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}