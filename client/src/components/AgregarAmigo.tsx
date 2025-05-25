import React, { useState } from 'react';

export default function AgregarAmigo() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const enviarSolicitud = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMensaje('Debes iniciar sesión para enviar solicitudes.');
      return;
    }

    if (!nombre.trim()) {
      setMensaje('Introduce un nombre de usuario válido.');
      return;
    }

    try {
      const res = await fetch('/api/amigos/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: nombre })
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || 'Error al enviar solicitud.');
      } else {
        setMensaje(data.message || 'Solicitud enviada.');
        setNombre('');
      }
    } catch (error) {
      setMensaje('Error de red. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div style={{
      marginBottom: '2rem',
      backgroundColor: '#1e1e1e',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
      maxWidth: '400px'
    }}>
      <h3 style={{ marginBottom: '0.8rem', color: '#1ed760' }}>Agregar amigo</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre de usuario"
          style={{
            padding: '10px',
            flex: 1,
            marginRight: '10px',
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '8px'
          }}
        />
        <button
          type="button"
          onClick={enviarSolicitud}
          style={{
            padding: '10px 16px',
            backgroundColor: '#1ed760',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Enviar
        </button>
      </div>
      {mensaje && <p style={{ color: mensaje.includes('Error') ? '#ff5252' : '#1ed760', marginTop: '10px' }}>{mensaje}</p>}
    </div>
  );
}
