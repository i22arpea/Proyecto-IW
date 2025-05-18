import React, { useState } from 'react';

interface LoginRegisterProps {
  onLogin: () => void;
  children?: React.ReactNode;
}

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const LoginRegister = function LoginRegister({ onLogin, children }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await fetch(`${API}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && isLogin) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        // alert(data.message || data.error);
      }
    } catch (err) {
      // alert('Error de red');
    }
  };

  return (
    <div>
      {children}
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Usuario"
          required
          value={form.username}
        />

        {!isLogin && (
          <input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
            type="email"
            value={form.email}
          />
        )}

        <input
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Contraseña"
          required
          type="password"
          value={form.password}
        />

        <button type="submit">{isLogin ? 'Entrar' : 'Registrarse'}</button>
      </form>

      <button
        aria-label="Toggle between login and register"
        onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: 'pointer' }}
        type="button"
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

LoginRegister.defaultProps = {
  children: undefined,
};

export default LoginRegister;
