import React, { useEffect, useState } from 'react';

interface Player {
  username: string;
  wins: number;
  totalGames: number;
  winRate: number;
  profileImage?: string;
}

export default function Ranking({ onClose }: { onClose?: () => void }) {
  const [ranking, setRanking] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);

      setError(null);

      try {
        const res = await fetch('/Proyecto-IW/api/stats/ranking/global');
        if (!res.ok) throw new Error('No se pudo cargar el ranking');
        const data = await res.json();
        setRanking(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al cargar el ranking global');
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []);

  return (
    <div className="ranking-modal"
      style={{
        background: 'var(--color-fondo)',
        borderRadius: 16,
        padding: 24,
        maxWidth: 420,
        margin: '2rem auto',
        boxShadow: '0 2px 16px #1ed76033',
        color: 'var(--color-texto)',
        position: 'relative',
        transition: 'background 0.3s, color 0.3s'
      }}
    >
      {onClose && (
        <button
          aria-label="Cerrar"
          style={{position:'absolute',top:12,right:12,background:'none',border:'none',color:'var(--color-texto-secundario)',fontSize:'1.7rem',cursor:'pointer',textAlign:'right'}}
          type="button"
          onClick={onClose}
        >
          ×
        </button>
      )}
      <h2 style={{color:'#1ed760',textAlign:'center',marginBottom:16}}>Clasificación General</h2>
      {loading && <div style={{color:'#1ed760'}}>Cargando ranking...</div>}
      {error && <div style={{color:'#ff5252'}}>{error}</div>}
      {!loading && !error && ranking.length === 0 && <em>No hay datos de ranking.</em>}
      {!loading && !error && ranking.length > 0 && (
        <table
          style={{
            width: '100%',
            background: 'var(--color-fondo)',
            borderRadius: 8,
            overflow: 'hidden',
            fontSize: '1rem',
            color: 'var(--color-texto)',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          <thead>
            <tr style={{color:'#1ed760',background:'var(--color-fondo)'}}>
              <th style={{padding:'6px 4px'}}>#</th>
              <th style={{padding:'6px 4px'}}>Usuario</th>
              <th style={{padding:'6px 4px'}}>Victorias</th>
              <th style={{padding:'6px 4px'}}>Partidas</th>
              <th style={{padding:'6px 4px'}}>Ratio</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, i) => (
              <tr key={player.username} style={{textAlign:'center',borderBottom:'1px solid #1ed76022', color: 'var(--color-texto)'}}>
                <td style={{padding:'6px 4px'}}>{i+1}</td>
                <td style={{padding:'6px 4px',fontWeight:600,display:'flex',alignItems:'center',gap:10, color: 'var(--color-texto)'}}>
                  <img
                    alt="avatar"
                    src={player.profileImage && player.profileImage !== '' ? player.profileImage : '/default-avatar.png'}
                    style={{width:32,height:32,borderRadius:'50%',border:'2px solid #1ed760',objectFit:'cover',background:'#23272f'}}
                  />
                  <span>{player.username}</span>
                </td>
                <td style={{padding:'6px 4px', color: 'var(--color-texto)'}}>{player.wins}</td>
                <td style={{padding:'6px 4px', color: 'var(--color-texto)'}}>{player.totalGames}</td>
                <td style={{padding:'6px 4px',fontWeight:700,color:'#1ed760'}}>{typeof player.winRate === 'number' ? player.winRate.toFixed(1) : '0.0'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

Ranking.defaultProps = {
  onClose: undefined,
};
