import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarAmigo from './AgregarAmigo';

interface User {
  username: string;
  email: string;
}

export default function AmistadesPanel() {
  const navigate = useNavigate();
  const [amigos, setAmigos] = useState<User[]>([]);
  const [solicitudes, setSolicitudes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Debes iniciar sesión para ver tus amigos y solicitudes.');
          setLoading(false);
          return;
        }
        const resAmigos = await fetch('/api/friends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resSolicitudes = await fetch('/api/friend-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const amigosData = await resAmigos.json();
        const solicitudesData = await resSolicitudes.json();
        setAmigos(Array.isArray(amigosData) ? amigosData : []);
        setSolicitudes(Array.isArray(solicitudesData) ? solicitudesData : []);
      } catch (err) {
        setError('Error al cargar amigos o solicitudes.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#181a1b' }}>
      <div style={{ background: '#23272f', borderRadius: 16, boxShadow: '0 4px 16px #000a', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', marginBottom: 10, fontWeight: 800, fontSize: '2rem', letterSpacing: '0.03em', textAlign: 'center' }}>Gestión de amistades</h1>
        <AgregarAmigo />
        <h2 style={{ color: '#1ed760', marginBottom: 24 }}>Solicitudes de amistad</h2>
        {loading ? (
          <p style={{ color: '#aaa' }}>Cargando...</p>
        ) : error ? (
          <p style={{ color: '#ff5252', textAlign: 'center' }}>{error}</p>
        ) : solicitudes.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center' }}>No tienes solicitudes pendientes.</p>
        ) : (
          <ul style={{ width: '100%', padding: 0, margin: 0, listStyle: 'none' }}>
            {solicitudes.map((s) => (
              <li key={s.username} style={{ color: '#fff', marginBottom: 8, background: '#222', borderRadius: 8, padding: 8 }}>
                {s.username} ({s.email})
              </li>
            ))}
          </ul>
        )}
        <h2 style={{ color: '#1ed760', margin: '32px 0 24px 0' }}>Tus amigos</h2>
        {loading ? (
          <p style={{ color: '#aaa' }}>Cargando...</p>
        ) : error ? (
          <p style={{ color: '#ff5252', textAlign: 'center' }}>{error}</p>
        ) : amigos.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center' }}>No tienes amigos aún.</p>
        ) : (
          <ul style={{ width: '100%', padding: 0, margin: 0, listStyle: 'none' }}>
            {amigos.map((a) => (
              <li key={a.username} style={{ color: '#fff', marginBottom: 8, background: '#222', borderRadius: 8, padding: 8 }}>
                {a.username} ({a.email})
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          style={{
            marginTop: 32,
            background: '#1ed760',
            color: '#181a1b',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 8,
            padding: '12px 28px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #1ed76044',
            transition: 'background 0.2s',
          }}
          onClick={() => navigate('/jugar')}
        >
          Volver al juego
        </button>
      </div>
    </div>
  );
}
