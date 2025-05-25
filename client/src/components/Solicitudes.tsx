import React, { useEffect, useState } from 'react';

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  const cargarSolicitudes = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/amigos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setSolicitudes(data.solicitudesPendientes || []);
  };

  const responder = async (from: string, accept: boolean) => {
    const token = localStorage.getItem('token');
    await fetch('/api/amigos/responder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ from, accept })
    });
    cargarSolicitudes();
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div style={{ marginBottom: '2rem', backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '12px', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', maxWidth: '400px' }}>
      <h3 style={{ marginBottom: '0.8rem', color: '#1ed760' }}>Solicitudes de amistad</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {solicitudes.map(sol => (
          <li key={sol.from} style={{ marginBottom: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{sol.from}</span>
            <div>
              <button type="button" onClick={() => responder(sol.from, true)} style={{ marginRight: '6px', padding: '6px 10px', borderRadius: '6px', backgroundColor: '#1ed760', border: 'none', cursor: 'pointer' }}>Aceptar</button>
              <button type="button" onClick={() => responder(sol.from, false)} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: '#ff5252', border: 'none', cursor: 'pointer' }}>Rechazar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}