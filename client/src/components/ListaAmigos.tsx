import React, { useEffect, useState } from 'react';

export default function ListaAmigos() {
  const [amigos, setAmigos] = useState<any[]>([]);

  useEffect(() => {
    const cargarAmigos = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/amigos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAmigos(data.amigos || []);
    };
    cargarAmigos();
  }, []);

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