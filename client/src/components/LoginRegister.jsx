import { useState } from 'react';

export default function LoginRegister({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
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
                alert(data.message || data.error);
            }
        } catch (err) {
            alert('Error de red');
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">{isLogin ? 'Entrar' : 'Registrarse'}</button>
            </form>
            <button
                type="submit"
                onClick={() => setIsLogin(!isLogin)}
                style={{ cursor: 'pointer' }}
                aria-label="Toggle between login and register"
            >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
        </div>
    );
}
