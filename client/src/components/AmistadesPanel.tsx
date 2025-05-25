import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarAmigo from './AgregarAmigo';
import Solicitudes from './Solicitudes';
import ListaAmigos from './ListaAmigos';

export default function AmistadesPanel() {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }
}, [navigate]);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2rem' }}>
      <h2 style={{ color: '#fff' }}>Gestión de Amistades</h2>
      <AgregarAmigo />
      <Solicitudes />
      <ListaAmigos />
    </div>
  );
}
