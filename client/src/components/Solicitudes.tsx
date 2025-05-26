import React, { useEffect, useState } from 'react';

interface Solicitud {
  _id: string;
  sender: {
    username: string;
  };
}

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [mensaje, setMensaje] = useState('');

  const cargarSolicitudes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSolicitudes([]);
      return;
    }

    try {
      const res = await fetch('/Proyecto-IW/api/amigos/solicitudes-recibidas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSolicitudes(data);
        setMensaje('');
      } else {
        setMensaje(data.message || 'Error al cargar solicitudes.');
      }
    } catch {
      setMensaje('Error de red.');
    }
  };

  const responder = async (requestId: string, accept: boolean) => {
  const token = localStorage.getItem('token');
  if (!token) {
    setMensaje('No has iniciado sesión');
    return;
  }

  try {
    const res = await fetch('/Proyecto-IW/api/amigos/responder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        requestId,
        action: accept ? 'accept' : 'reject'
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setMensaje(data.message || 'Error al procesar la solicitud');
      return;
    }

    setMensaje(data.message || '');
    cargarSolicitudes();
  } catch (error) {
    console.error('❌ Error en la solicitud:', error);
    setMensaje('Error al procesar la solicitud');
  }
};

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div style={{ marginBottom: '2rem', backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '12px', maxWidth: '400px' }}>
      <h3 style={{ marginBottom: '0.8rem', color: '#1ed760' }}>Solicitudes de amistad</h3>
      {mensaje && <p style={{ color: '#1ed760' }}>{mensaje}</p>}
      {solicitudes.length === 0 && <p style={{ color: '#ccc' }}>No tienes solicitudes pendientes.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {solicitudes.map(sol => (
          <li key={sol._id} style={{ marginBottom: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{sol.sender.username}</span>
            <div>
              <button
                type="button"
                onClick={() => responder(sol._id, true)}
                style={{ marginRight: '6px', padding: '6px 10px', borderRadius: '6px', backgroundColor: '#1ed760', border: 'none', cursor: 'pointer' }}
              >
                Aceptar
              </button>
              <button
                type="button"
                onClick={() => responder(sol._id, false)}
                style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: '#ff5252', border: 'none', cursor: 'pointer' }}
              >
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
