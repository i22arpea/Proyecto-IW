import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  username: string;
  email: string;
  name?: string;
  surname?: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setForm(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Perfil actualizado');
        const data = await res.json();
        setUser(data);
      } else {
        const data = await res.json();
        setMessage(data.message || 'Error al actualizar');
      }
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && !user) return <div style={{color:'#1ed760',textAlign:'center',marginTop:40}}>Cargando perfil...</div>;
  if (!user) return <div style={{color:'#ff5252',textAlign:'center',marginTop:40}}>No se pudo cargar el perfil.</div>;

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
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}`} alt="avatar" style={{width:80,height:80,borderRadius:'50%',marginBottom:8}}/>
        <div style={{fontWeight:700,fontSize:'1.2rem',color:'#fff'}}>{user.username}</div>
        <div style={{color:'#aaa',fontSize:'1rem'}}>{user.email}</div>
      </div>
      <form onSubmit={handleSubmit} style={{marginTop:24,display:'flex',flexDirection:'column',gap:16}}>
        <input name="name" value={form.name||''} onChange={handleChange} placeholder="Nombre" style={{padding:8,borderRadius:8,border:'1.5px solid #1ed760',background:'#181a1b',color:'#fff'}}/>
        <input name="surname" value={form.surname||''} onChange={handleChange} placeholder="Apellidos" style={{padding:8,borderRadius:8,border:'1.5px solid #1ed760',background:'#181a1b',color:'#fff'}}/>
        <input name="profileImage" value={form.profileImage||''} onChange={handleChange} placeholder="URL de imagen de perfil" style={{padding:8,borderRadius:8,border:'1.5px solid #1ed760',background:'#181a1b',color:'#fff'}}/>
        <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</button>
      </form>
      {message && <div style={{marginTop:12,textAlign:'center',color:message.includes('actualizado')?'#1ed760':'#ff5252'}}>{message}</div>}
      <hr style={{margin:'2rem 0',borderColor:'#1ed76033'}}/>
      <h3 style={{color:'#1ed760',marginBottom:8}}>Historial de partidas</h3>
      <div style={{color:'#fff',marginBottom:24}}>
        {/* Aquí puedes mapear partidas del usuario */}
        <em>Próximamente: historial de partidas.</em>
      </div>
      <h3 style={{color:'#1ed760',marginBottom:8}}>Amigos</h3>
      <div style={{color:'#fff'}}>
        {/* Aquí puedes mapear amigos del usuario */}
        <em>Próximamente: gestión de amigos.</em>
      </div>
      {/* Botón cerrar sesión abajo a la derecha */}
      <button
        type="button"
        onClick={handleLogout}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        style={{position:'absolute',bottom:24,right:24,background:'#1ed760',border:'none',color:'#181a1b',fontWeight:700,borderRadius:8,padding:'10px 22px',fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px #1ed76033',transition:'background 0.2s'}}
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
