import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { desencriptarPalabra } from '../libs/crypto';
import UserStats from './UserStats'; 
import fetchUserStats from '../utils/fetchUserStats';


interface UserProfile {
  username: string;
  email: string;
  name?: string;
  surname?: string;
  profileImage?: string;
}

// Hook para detectar si está en modo claro
function useIsLightMode() {
  const [isLight, setIsLight] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('light-mode')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.body.classList.contains('light-mode'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const isLightMode = useIsLightMode();

  // Estado para el historial de partidas
  const [history, setHistory] = useState<Array<{
    _id: string;
    secretWord: string;
    won: boolean;
    attemptsUsed: number;
    createdAt: string;
  }>>([]);

  const [historyLoading, setHistoryLoading] = useState(false);

  // Estado para estadísticas del usuario
  const [userStats, setUserStats] = useState<Record<string, unknown> | null>(null);

  const [statsLoading, setStatsLoading] = useState(false);

  // Estado para partidas guardadas en curso
  const [inProgressGames, setInProgressGames] = useState<Array<{
    _id: string;
    secretWord: string;
    attempts: string[];
    hardModeMustContain?: any[];
    row?: number;
    position?: number;
    idioma?: string;
    categoria?: string;
    longitud?: number;
    createdAt: string;
  }>>([]);

  // Cargar perfil, historial y estadísticas al montar el componente  
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/usuarios/verPerfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } finally {
        setLoading(false);
      }
    }

    async function fetchHistory() {
      setHistoryLoading(true);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/usuarios/historial', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } finally {
        setHistoryLoading(false);
      }
    }

    async function fetchStats() {
      setStatsLoading(true);

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');
        const data = await fetchUserStats(token);
        setUserStats(data);
      } catch (err) {
        setMessage('Error al cargar estadísticas.');
      } finally {
        setStatsLoading(false);
      }
    }

    async function fetchInProgressGames() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/partidas/guardadas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Normalizar para asegurar que todos los campos existen
          setInProgressGames(
            Array.isArray(data)
              ? data.map(g => ({
                  ...g,
                  hardModeMustContain: g.hardModeMustContain ?? [],
                  row: g.row ?? 1,
                  position: g.position ?? 1,
                  idioma: g.idioma ?? 'es',
                  categoria: g.categoria ?? 'general',
                  longitud: g.longitud ?? 5,
                }))
              : []
          );
        }
      } catch (e) {
        // Opcional: puedes mostrar un mensaje de error si lo deseas
      }
    }

    fetchProfile();
    fetchHistory();
    fetchStats(); // <-- SIEMPRE obtiene estadísticas de la base de datos
    fetchInProgressGames();
  }, []);

  // Botón de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Para refrescar el header
  };

  // Botón cerrar ventana (volver al juego)
  const handleClose = () => {
    navigate('/jugar');
  };

  // Handlers para hover/focus accesibles
  const handleCloseMouseOver = (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = '#1ed760';
  };

  const handleCloseMouseOut = (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = '#aaa';
  };

  const handleLogoutMouseOver = (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#16b34a';
  };

  const handleLogoutMouseOut = (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#1ed760';
  };

  // Nuevo: control de edición por campo
  const [editField, setEditField] = useState<'username' | 'password' | 'name' | null>(null);

  const [editValue, setEditValue] = useState<string>('');

  const [currentPassword, setCurrentPassword] = useState('');

  // Función para continuar una partida guardada en curso
  type InProgressGame = {
    _id: string;
    secretWord: string;
    attempts: string[];
    hardModeMustContain?: any[];
    row?: number;
    position?: number;
    idioma?: string;
    categoria?: string;
    longitud?: number;
    createdAt: string;
  };

  const continueInProgressGame = async (game: InProgressGame) => {
    // Guardar el estado completo de la partida en curso en el backend antes de continuar
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/partidas/guardar-progreso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          secretWord: game.secretWord,
          attempts: game.attempts,
          hardModeMustContain: game.hardModeMustContain ?? [],
          row: game.row ?? 1,
          position: game.position ?? 1,
          idioma: game.idioma,
          categoria: game.categoria,
          longitud: game.longitud,
          gameId: game._id,
        }),
      });
    } catch (e) {
      setMessage('Error de red al guardar la partida.');
    }
    // Guardar también en localStorage para restaurar en el cliente
    localStorage.setItem('inProgressGame', JSON.stringify(game));
    navigate('/jugar', { state: { continueGame: true, gameId: game._id } });
    // Limpiar la partida guardada tras continuarla
    setTimeout(() => localStorage.removeItem('inProgressGame'), 1000);
  };

  if (loading && !user) return <div style={{color:'#1ed760',textAlign:'center',marginTop:40}}>Cargando perfil...</div>;
  if (!user) return <div style={{color:'#ff5252',textAlign:'center',marginTop:40}}>No se pudo cargar el perfil.</div>;

  // Si user existe, renderizar los datos
  return (
    <div className="profile-page" style={{
      maxWidth: 700,
      margin: '2rem auto',
      background: 'var(--color-fondo)',
      color: isLightMode ? '#111' : 'var(--color-texto', // Forzar color principal
      borderRadius: 20,
      padding: '2rem',
      boxShadow: '0 2px 16px #1ed76033',
      position: 'relative',
      fontSize: '0.97rem',
      transition: 'background 0.3s, color 0.3s'
    }}>
      {/* Botón cerrar ventana arriba a la derecha */}
      <button
        aria-label="Cerrar ventana"
        onBlur={handleCloseMouseOut}
        onClick={handleClose}
        onFocus={handleCloseMouseOver}
        onMouseOut={handleCloseMouseOut}
        onMouseOver={handleCloseMouseOver}
        style={{position:'absolute',top:18,right:18,background:'none',border:'none',color:'#aaa',fontSize:'1.5rem',cursor:'pointer',transition:'color 0.2s',padding:0,zIndex:2}}
        title="Cerrar ventana"
        type="button"
      >
        ×
      </button>
      <h2 style={{textAlign:'center',color:'#1ed760',marginBottom:'2.5rem', fontSize:'1.25rem'}}>Perfil de usuario</h2>
      {/* Datos personales y avatar alineados */}
      <div style={{display:'flex',flexDirection:'row',alignItems:'flex-start',gap:32,marginBottom:24}}>
        {/* Datos personales a la izquierda */}
        <div style={{
          flex: 1,
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          alignItems: 'flex-start',
          color: 'var(--color-texto)'
        }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{color:isLightMode ? '#000' : '#fff',minWidth:80, fontSize:'0.98rem'}}>Usuario:</span>
            <span style={{color:isLightMode ? '#222' : '#aaa', fontSize:'0.98rem'}}>{user.username}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{color:isLightMode ? '#000' : '#fff',minWidth:80, fontSize:'0.98rem'}}>Nombre:</span>
            {editField === 'name' ? (
              <>
                <input
                  name="name"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  style={{padding:7,borderRadius:8,border:'1.5px solid #1ed760',background:isLightMode ? '#fff' : '#181a1b',color:isLightMode ? '#111' : '#fff',flex:1,fontSize:'0.97rem'}}
                />
                <button
                  className="login-btn"
                  style={{marginLeft:8,padding:'6px 14px',fontSize:'0.95rem'}}
                  onClick={async () => {
                    setLoading(true);
                    setMessage(null);
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch('/api/usuarios/modificarPerfil', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name: editValue }),
                      });
                      if (res.ok) {
                        const updatedUser = await res.json();
                        setUser(prev => ({ ...prev!, name: updatedUser.name }));
                        setMessage('Nombre actualizado');
                        setEditField(null);
                      } else {
                        const errorData = await res.json();
                        setMessage(errorData.message || 'Error al actualizar');
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  type="button"
                  disabled={loading}
                >
                  Guardar
                </button>
                <button
                  style={{marginLeft:4,padding:'6px 10px',fontSize:'0.95rem',background:'#ff5252',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}
                  onClick={() => setEditField(null)}
                  type="button"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span style={{color:isLightMode ? '#222' : '#aaa', fontSize:'0.98rem'}}>{user.name || '-'}</span>
                <button
                  style={{marginLeft:8,padding:'6px 14px',fontSize:'0.95rem',background:'#1ed760',color:'#181a1b',border:'none',borderRadius:6,cursor:'pointer'}}
                  onClick={() => { setEditField('name'); setEditValue(user.name || ''); }}
                  type="button"
                >
                  Editar
                </button>
              </>
            )}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:10,wordBreak:'break-word',overflowWrap:'anywhere'}}>
              <span style={{color:isLightMode ? '#000' : '#fff',minWidth:80, fontSize:'0.98rem'}}>Email:</span>
            {user && <span style={{color:isLightMode ? '#222' : '#aaa',wordBreak:'break-word', fontSize:'0.98rem'}}>{user.email}</span>}
          </div>
          {/* Contraseña y botón cambiar al lado */}
          <div style={{display:'flex',alignItems:'center',gap:10,position:'relative'}}>
            <span style={{color:isLightMode ? '#000' : '#fff',minWidth:80, fontSize:'0.98rem'}}>Contraseña:</span>
            <span style={{color:isLightMode ? '#222' : '#aaa', fontSize:'0.98rem'}}>********</span>
            <button
              style={{marginLeft:8,padding:'6px 14px',fontSize:'0.95rem',background:'#1ed760',color:'#181a1b',border:'none',borderRadius:6,cursor:'pointer'}}
              onClick={() => setEditField(editField === 'password' ? null : 'password')}
              type="button"
            >
              Cambiar
            </button>
          </div>
          {/* Formulario de cambio de contraseña debajo */}
          {editField === 'password' && (
            <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8,marginTop:8,marginLeft:0}}>
              <input
                type="password"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                style={{padding:'8px',borderRadius:6,border:'1px solid #333',background:isLightMode ? '#fff' : '#181a1b',color:isLightMode ? '#111' : '#fff',width:'100%',fontSize:'0.97rem'}}
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{padding:'8px',borderRadius:6,border:'1px solid #333',background:isLightMode ? '#fff' : '#181a1b',color:isLightMode ? '#111' : '#fff',width:'100%',fontSize:'0.97rem'}}
              />
              <div style={{display:'flex',gap:8,marginTop:4}}>
                <button
                  style={{padding:'6px 14px',fontSize:'0.95rem',background:'#1ed760',color:'#181a1b',border:'none',borderRadius:6,cursor:'pointer'}}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch('/api/usuarios/cambiarPassword', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ currentPassword, newPassword: editValue }),
                      });
                      if (res.ok) {
                        setMessage('Contraseña actualizada');
                        const data = await res.json();
                        setUser(data);
                        setEditField(null);
                        setCurrentPassword('');
                        setEditValue('');
                      } else {
                        const data = await res.json();
                        setMessage(data.message || 'Error al actualizar');
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  type="button"
                  disabled={loading}
                >
                  Guardar
                </button>
                <button
                  style={{padding:'6px 10px',fontSize:'0.95rem',background:'#ff5252',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}
                  onClick={() => { setEditField(null); setCurrentPassword(''); setEditValue(''); }}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Avatar a la derecha */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minWidth: 120
        }}>
          <img
            src={user.profileImage && user.profileImage !== '' ? user.profileImage : '/default-avatar.png'}
            alt="Avatar"
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: '3px solid #1ed760',
              background: 'var(--color-fondo)',
              objectFit: 'cover',
              marginBottom: 8
            }}
            id="profile-avatar-img"
          />
          <label htmlFor="profile-image-upload" style={{cursor:'pointer',color:'#1ed760',fontSize:16}} title="Cambiar foto">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M4.8 17.2V6.8A2 2 0 0 1 6.8 4.8h10.4a2 2 0 0 1 2 2v10.4a2 2 0 0 1-2 2H6.8a2 2 0 0 1-2-2z"/></svg>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              style={{display:'none'}} 
              onChange={async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const file = e.target.files[0];
                // Mostrar preview inmediata
                const previewUrl = URL.createObjectURL(file);
                setUser(prev => prev ? { ...prev, profileImage: previewUrl } : prev);
                const formData = new FormData();
                formData.append('profileImage', file);
                const token = localStorage.getItem('token');
                setLoading(true);
                try {
                  const res = await fetch('/api/usuarios/subirFoto', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                  });
                  if (res.ok) {
                    // Recargar el perfil desde el backend para obtener la URL definitiva
                    const profileRes = await fetch('/api/usuarios/verPerfil', {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    if (profileRes.ok) {
                      const data = await profileRes.json();
                      setUser(data);
                      setMessage('Foto actualizada');
                    }
                  } else {
                    const data = await res.json();
                    setMessage(data.message || 'Error al subir la imagen');
                  }
                } finally {
                  setLoading(false);
                  setTimeout(() => URL.revokeObjectURL(previewUrl), 2000);
                }
              }}
            />
          </label>
        </div>
      </div>
      {/* Separador visual entre datos personales y estadísticas */}
      <div style={{
        width: '100%',
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '18px 0',
        color: 'var(--color-texto)'
      }}>
        <div style={{height:2,background:'#1ed76033',borderRadius:2,flex:1}}></div>
        <span style={{margin:'0 18px',color:'#1ed760',fontWeight:600,letterSpacing:1,fontSize:'1.01rem'}}>Resumen</span>
        <div style={{height:2,background:'#1ed76033',borderRadius:2,flex:1}}></div>
      </div>
      {/* Estadísticas y gráfico */}
      <div style={{
        marginBottom: 32,
        marginTop: 36,
        color: 'var(--color-texto)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 18
        }}>
          <h3 style={{ color: '#1ed760', fontSize: '1.18rem', margin: 0, letterSpacing: 1 }}>Estadísticas</h3>
        </div>
        <div style={{ marginBottom: 18, marginTop: 10 }}>
          {statsLoading ? (
            <div style={{ color: '#1ed760', textAlign: 'center' }}>Cargando estadísticas...</div>
          ) : userStats ? (
            <UserStats stats={userStats} />
          ) : history.length > 0 ? (
            (() => {
              const total = history.length;
              const wins = history.filter(h => h.won).length;
              const loses = total - wins;
              const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0';
              return (
                <div style={{ color: isLightMode ? '#111' : '#fff', textAlign: 'center', fontSize: '1.05rem' }}>
                  <div><b>Total partidas:</b> {total}</div>
                  <div><b>Victorias:</b> {wins}</div>
                  <div><b>Derrotas:</b> {loses}</div>
                  <div><b>Winrate:</b> {winRate}%</div>
                </div>
              );
            })()
          ) : (
            <div style={{ color: '#ff5252', textAlign: 'center' }}>No se pudieron cargar las estadísticas.</div>
          )}
        </div>
      </div>
      <hr style={{ margin: '1.5rem 0', borderColor: '#1ed76033' }} />
      {/* Historial de partidas jugadas */}
      <div style={{ marginBottom: 32, color: 'var(--color-texto)' }}>
        <h3 style={{ color: '#1ed760', marginBottom: 8, fontSize: '1.08rem' }}>Historial de partidas jugadas</h3>
        {historyLoading ? (
          <div style={{ color: '#1ed760' }}>Cargando historial...</div>
        ) : history.length === 0 ? (
          <em>No hay partidas jugadas.</em>
        ) : (
          <table style={{
            width: '100%',
            background: 'var(--color-fondo)',
            borderRadius: 8,
            overflow: 'hidden',
            fontSize: '0.97rem',
            color: isLightMode ? '#111' : 'var(--color-texto'
          }}>
            <thead>
              <tr style={{ color: '#1ed760', background: 'var(--color-fondo)' }}>
                <th style={{ padding: '6px 4px' }}>Fecha</th>
                <th style={{ padding: '6px 4px' }}>Palabra</th>
                <th style={{ padding: '6px 4px' }}>Intentos</th>
                <th style={{ padding: '6px 4px' }}>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ _id: id, secretWord, won, attemptsUsed, createdAt }) => (
                <tr key={id} style={{ textAlign: 'center', borderBottom: '1px solid #1ed76022' }}>
                  <td style={{ padding: '6px 4px' }}>{new Date(createdAt).toLocaleString()}</td>
                  <td style={{ padding: '6px 4px', fontFamily: 'monospace', fontWeight: 600 }}>
                    {(() => {
                      const palabra = desencriptarPalabra(secretWord);
                      return palabra && typeof palabra === 'string' ? palabra.toUpperCase() : secretWord;
                    })()}
                  </td>
                  <td style={{ padding: '6px 4px' }}>{attemptsUsed}</td>
                  <td style={{ padding: '6px 4px', color: won ? '#1ed760' : '#ff5252', fontWeight: 700 }}>{won ? 'Victoria' : 'Derrota'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Historial de partidas guardadas */}
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: '#1ed760', margin: '16px 0 8px', fontSize: '1.08rem' }}>Partidas guardadas (en curso)</h3>
        {inProgressGames.length === 0 ? (
          <em>No hay partidas guardadas en curso.</em>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flexDirection: 'row' }}>
            {inProgressGames.map((game) => {
              const idioma = game.idioma ? game.idioma.toUpperCase() : 'N/A';
              const categoria = game.categoria ? game.categoria.toUpperCase() : '';
              return (
                <span key={game._id} style={{
                  background: '#1ed76022',
                  color: '#1ed760',
                  border: '1px solid #1ed760',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '0.97rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14
                }}>
                  <span style={{fontWeight:700}}>
                    {categoria ? `${idioma} / ${categoria}` : idioma}
                  </span>
                  <span>|</span>
                  <span style={{fontWeight:700}}>Letras:</span> {game.longitud ?? '?'}
                  <span>|</span>
                  <span style={{fontWeight:700}}>Intentos:</span> {game.attempts?.length ?? 0}
                  <button
                    type="button"
                    style={{ marginLeft: 10, background: '#1ed760', color: '#181a1b', border: 'none', borderRadius: 6, padding: '2px 10px', fontWeight: 700, fontSize: '0.93rem', cursor: 'pointer' }}
                    onClick={() => continueInProgressGame(game)}
                  >
                    Continuar
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
      {message && <div style={{marginTop:12,textAlign:'center',color:message.includes('actualizada')||message.includes('actualizado')?'#1ed760':'#ff5252', fontSize:'0.97rem'}}>{message}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button
          aria-label="Cerrar sesión"
          onBlur={handleLogoutMouseOut}
          onClick={handleLogout}
          onFocus={handleLogoutMouseOver}
          onMouseOut={handleLogoutMouseOut}
          onMouseOver={handleLogoutMouseOver}
          style={{
            marginTop: '2rem',
            background: '#1ed760',
            border: 'none',
            color: '#181a1b',
            fontWeight: 700,
            borderRadius: 8,
            padding: '10px 22px',
            fontSize: '0.97rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #1ed76033',
            transition: 'background 0.2s',
            alignSelf: 'flex-end'
          }}
          title="Cerrar sesión"
          type="button"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Botón eliminar cuenta abajo a la izquierda */}
      <button
        type="button"
        onClick={async () => {
          setMessage('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer. Haz clic en "Eliminar cuenta" nuevamente para confirmar.');
          if (message === '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer. Haz clic en "Eliminar cuenta" nuevamente para confirmar.') {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/usuarios', {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            } else {
              setMessage('No se pudo eliminar la cuenta.');
            }
          }
        }}
        style={{
          position: 'absolute',
          left: 32,
          bottom: 32,
          background: '#ff5252',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '9px 18px',
          fontWeight: 700,
          fontSize: '0.97rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #ff525233',
          transition: 'background 0.2s',
          zIndex: 10
        }}
      >
        Eliminar cuenta
      </button>
    </div>
  );
}
