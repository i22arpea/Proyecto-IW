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
          placeholder="Usuario"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {!isLogin && (
          <input
            placeholder="Email"
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        )}

        <input
          placeholder="Contraseña"
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">{isLogin ? 'Entrar' : 'Registrarse'}</button>
      </form>

      <button
        aria-label="Toggle between login and register"
        style={{ cursor: 'pointer' }}
        type="button"
        onClick={() => setIsLogin(!isLogin)}
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
