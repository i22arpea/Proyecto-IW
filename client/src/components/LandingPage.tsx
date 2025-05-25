import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#1ed760',
        marginBottom: '2rem',
        textShadow: '0 0 10px #1ed76088'
      }}>
        Bienvenido a Wordle 2.0
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 300 }}>
        <button
          type="button"
          style={botonEstilo}
          onClick={() => navigate('/register')}
        >
          Registrarse
        </button>

        <button
          type="button"
          style={botonEstilo}
          onClick={() => navigate('/login')}
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          style={{ ...botonEstilo, backgroundColor: '#1ed760', color: '#000', fontWeight: 'bold' }}
          onClick={() => navigate('/jugar')}
        >
          Jugar partida
        </button>
      </div>
    </div>
  );
}

const botonEstilo: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: '1.1rem',
  borderRadius: '8px',
  backgroundColor: '#333',
  color: '#fff',
  border: '1px solid #555',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};
