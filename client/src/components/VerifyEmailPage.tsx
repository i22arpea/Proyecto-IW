import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token || token === 'null' || token === 'undefined') {
      setMessage('Token de verificación inválido o faltante.');
      setLoading(false);
      return;
    }
    fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(async res => {
        const data = await res.json();
        setMessage(data.message || data.error || 'Error al verificar el correo.');
      })
      .catch(() => {
        setMessage('Error de red al verificar el correo.');
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="profile-page" style={{maxWidth:400,margin:'2rem auto',background:'#23272f',borderRadius:20,padding:'2rem',boxShadow:'0 2px 16px #1ed76033'}}>
      <h2 style={{textAlign:'center',color:'#1ed760',marginBottom:'1.5rem'}}>Verificación de correo</h2>
      {loading ? (
        <div style={{color:'#1ed760',textAlign:'center',marginTop:40}}>Verificando...</div>
      ) : (
        <div style={{color:message?.includes('correctamente') ? '#1ed760' : '#ff5252',textAlign:'center',marginTop:24,fontSize:'1.1rem'}}>{message}</div>
      )}
      <button
        className="login-btn"
        type="button"
        style={{margin:'2rem auto 0',display:'block'}}
        onClick={() => navigate('/')}
      >
        Volver al inicio
      </button>
    </div>
  );
}
