import React, { useEffect, useState } from 'react';

export default function ListaAmigos() {
  const [amigos, setAmigos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAmigos = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAmigos([]);
        setCargando(false);
        return;
      }

      try {
        const res = await fetch('/api/amigos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
          setAmigos(data);
        } else {
          setAmigos([]);
        }
      } catch {
        setAmigos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarAmigos();
  }, []);

  if (cargando) return null; // o un loader si prefieres

  if (amigos.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem', backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '12px', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', maxWidth: '400px' }}>
      <h3 style={{ marginBottom: '0.8rem', color: '#1ed760' }}>Mis amigos</h3>
      <ul style={{ listStyle: 'none', padding: 0, color: '#fff' }}>
        {amigos.map(amigo => (
          <li key={amigo.username} style={{ padding: '6px 0' }}>{amigo.username}</li>
        ))}
      </ul>
    </div>
  );
}
