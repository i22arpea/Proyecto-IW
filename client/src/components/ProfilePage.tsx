import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import UserStats from './UserStats'; // Asegúrate de que la ruta sea correcta

interface UserProfile {
  username: string;
  email: string;
  name?: string;
  surname?: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Estado para el historial de partidas
  const [history, setHistory] = useState<Array<{
    _id: string;
    secretWord: string;
    won: boolean;
    attemptsUsed: number;
    createdAt: string;
  }>>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Cargar perfil y historial al montar el componente  
  const [stats, setStats] = useState<{
  totalGames: number;
  wins: number;
  losses: number;
  winStreak: number;
  maxWinStreak: number;
  winRate: number;
} | null>(null);

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
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/usuarios/estadisticas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error al obtener estadísticas');
      }
    }
    fetchStats();

    fetchProfile();
    fetchHistory();
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
    navigate('/');
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

  if (loading && !user) return <div style={{color:'#1ed760',textAlign:'center',marginTop:40}}>Cargando perfil...</div>;
  if (!user) return <div style={{color:'#ff5252',textAlign:'center',marginTop:40}}>No se pudo cargar el perfil.</div>;

  // Si user existe, renderizar los datos
  return (
    <div className="profile-page" style={{maxWidth:500,margin:'2rem auto',background:'#23272f',borderRadius:20,padding:'2rem',boxShadow:'0 2px 16px #1ed76033',position:'relative'}}>
      {/* Botón cerrar ventana arriba a la derecha */}
      <button
        type="button"
        onClick={handleClose}
        title="Cerrar ventana"
        aria-label="Cerrar ventana"
        style={{position:'absolute',top:18,right:18,background:'none',border:'none',color:'#aaa',fontSize:'1.7rem',cursor:'pointer',transition:'color 0.2s',padding:0,zIndex:2}}
        onMouseOver={handleCloseMouseOver}
        onFocus={handleCloseMouseOver}
        onMouseOut={handleCloseMouseOut}
        onBlur={handleCloseMouseOut}
      >
        ×
      </button>
      <h2 style={{textAlign:'center',color:'#1ed760',marginBottom:'1.5rem'}}>Perfil de usuario</h2>
      <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:16}}>

      {/* Usuario (solo lectura, no editable) */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <span style={{color:'#fff',minWidth:90}}>Usuario:</span>
        <span style={{color:'#aaa'}}>{user.username}</span>
      </div>


         {/* Sección de nombre editable */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          <span style={{color:'#fff',minWidth:90}}>Nombre:</span>
          {editField === 'name' ? (
            <>
              <input
                name="name"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{padding:8,borderRadius:8,border:'1.5px solid #1ed760',background:'#181a1b',color:'#fff',flex:1}}
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
              <span style={{color:'#aaa'}}>{user.name || '-'}</span>
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

        {/* Email (solo lectura, sin botón) */}
        <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:12,wordBreak:'break-word',overflowWrap:'anywhere'}}>
          <span style={{color:'#fff',minWidth:90}}>Email:</span>
          {user && <span style={{color:'#aaa',wordBreak:'break-word'}}>{user.email}</span>}
        </div>

        {/* Contraseña */}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{color:'#fff',minWidth:90}}>Contraseña:</span>
          {editField === 'password' ? (
            <>
              <input
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Contraseña actual"
                style={{padding:8,borderRadius:8,border:'1.5px solid #1ed760',background:'#181a1b',color:'#fff',flex:1}}
              />
              <input
                name="newPassword"
                type="password"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                placeholder="Nueva contraseña"
                style={{padding:8,borderRadius:8,border:'1.5px solid #1ed760',background:'#181a1b',color:'#fff',flex:1,marginLeft:8}}
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
                style={{marginLeft:4,padding:'6px 10px',fontSize:'0.95rem',background:'#ff5252',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}
                onClick={() => { setEditField(null); setCurrentPassword(''); setEditValue(''); }}
                type="button"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <span style={{color:'#aaa'}}>********</span>
              <button
                style={{marginLeft:8,padding:'6px 14px',fontSize:'0.95rem',background:'#1ed760',color:'#181a1b',border:'none',borderRadius:6,cursor:'pointer'}}
                onClick={() => { setEditField('password'); setEditValue(''); setCurrentPassword(''); }}
                type="button"
              >
                Cambiar
              </button>
            </>
          )}
        </div>
      </div>
      {message && <div style={{marginTop:12,textAlign:'center',color:message.includes('actualizada')||message.includes('actualizado')?'#1ed760':'#ff5252'}}>{message}</div>}
      <hr style={{margin:'2rem 0',borderColor:'#1ed76033'}}/>
      <h3 style={{color:'#1ed760',marginBottom:8}}>Estadísticas</h3>
      <div style={{color:'#fff',marginBottom:24}}>
        {/* Estadísticas del usuario */}
        {stats ? (
          <ul style={{listStyle: 'none', paddingLeft: 0}}>
            <li>Total partidas: {stats.totalGames}</li>
            <li>Victorias: {stats.wins}</li>
            <li>Derrotas: {stats.losses}</li>
            <li>Racha actual: {stats.winStreak}</li>
            <li>Máx. racha: {stats.maxWinStreak}</li>
            <li>% Victorias: {typeof stats.winRate === 'number' ? stats.winRate.toFixed(2) : '0.00'}%</li>
          </ul>
        ) : (
          <em>No hay estadísticas disponibles.</em>
        )}

      </div>
      <h3 style={{color:'#1ed760',marginBottom:8}}>Historial de partidas</h3>
      <div style={{color:'#fff',marginBottom:24}}>
        {historyLoading && <div style={{color:'#1ed760'}}>Cargando historial...</div>}
        {!historyLoading && history.length === 0 && <em>No hay partidas registradas.</em>}
        {!historyLoading && history.length > 0 && (
          <table style={{width:'100%',background:'#181a1b',borderRadius:8,overflow:'hidden',fontSize:'0.98rem'}}>
            <thead>
              <tr style={{color:'#1ed760',background:'#23272f'}}>
                <th style={{padding:'6px 4px'}}>Fecha</th>
                <th style={{padding:'6px 4px'}}>Palabra</th>
                <th style={{padding:'6px 4px'}}>Intentos</th>
                <th style={{padding:'6px 4px'}}>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ _id: id, secretWord, won, attemptsUsed, createdAt }) => (
                <tr key={id} style={{textAlign:'center',borderBottom:'1px solid #1ed76022'}}>
                  <td style={{padding:'6px 4px'}}>{new Date(createdAt).toLocaleString()}</td>
                  <td style={{padding:'6px 4px',fontFamily:'monospace',fontWeight:600}}>{secretWord.toUpperCase()}</td>
                  <td style={{padding:'6px 4px'}}>{attemptsUsed}</td>
                  <td style={{padding:'6px 4px',color:won?'#1ed760':'#ff5252',fontWeight:700}}>{won ? 'Victoria' : 'Derrota'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        {/* Foto de perfil */}
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <span style={{color:'#fff',minWidth:90}}>Foto:</span>
        <img
          src={user.profileImage || '/default-avatar.png'}
          alt="Avatar"
          style={{width:48,height:48,borderRadius:'50%',border:'2px solid #1ed760'}}
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];
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
                const data = await res.json();
                setUser(prev => ({ ...prev!, profileImage: data.profileImage }));
                setMessage('Foto actualizada');
              } else {
                const data = await res.json();
                setMessage(data.message || 'Error al subir la imagen');
              }
            } finally {
              setLoading(false);
            }
          }}
          style={{marginLeft:12, color: '#fff'}}
        />
      </div>

      {/* Botón cerrar sesión abajo a la derecha */}
      <button
        type="button"
        onClick={handleLogout}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        style={{
          marginTop: '2rem',
          background: '#1ed760',
          border: 'none',
          color: '#181a1b',
          fontWeight: 700,
          borderRadius: 8,
          padding: '10px 22px',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #1ed76033',
          transition: 'background 0.2s',
          alignSelf: 'flex-end'
        }}
        onMouseOver={handleLogoutMouseOver}
        onFocus={handleLogoutMouseOver}
        onMouseOut={handleLogoutMouseOut}
        onBlur={handleLogoutMouseOut}
      >
        Cerrar sesión
      </button>

    </div>
  );
}
