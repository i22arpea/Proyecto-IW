import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);

    if (!password || !password2) {
      setMessage('Por favor, completa ambos campos.');
      return;
    }

    if (password !== password2) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/Proyecto-IW/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      if (res.ok) {
        setMessage('Contraseña restablecida correctamente. Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Error al restablecer la contraseña.');
      }
    } catch {
      setMessage('Error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div style={{color:'#ff5252',textAlign:'center',marginTop:40}}>Token inválido o faltante.</div>;
  }

  return (
    <div className="profile-page" style={{maxWidth:400,margin:'2rem auto',background:'#23272f',borderRadius:20,padding:'2rem',boxShadow:'0 2px 16px #1ed76033'}}>
      <h2 style={{textAlign:'center',color:'#1ed760',marginBottom:'1.5rem'}}>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
        <input
          autoComplete="new-password"
          placeholder="Nueva contraseña"
          style={{background:'#181a1b',border:'1.5px solid #1ed760',borderRadius:8,color:'#fff',padding:8}}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          autoComplete="new-password"
          placeholder="Repite la nueva contraseña"
          style={{background:'#181a1b',border:'1.5px solid #1ed760',borderRadius:8,color:'#fff',padding:8}}
          type="password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
        <button
          className="login-btn"
          disabled={loading}
          style={{fontSize:'1.08rem',padding:'12px 0',width:'100%'}}
          type="submit"
        >
          {loading ? 'Guardando...' : 'Restablecer contraseña'}
        </button>
      </form>
      {message && <div style={{marginTop:12,textAlign:'center',color:message.includes('correctamente')?'#1ed760':'#ff5252'}}>{message}</div>}
    </div>
  );
}
