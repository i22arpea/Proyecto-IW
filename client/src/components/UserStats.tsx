import React from 'react';

interface UserStatsProps {
  stats: {
    totalGames?: number;
    wins?: number;
    losses?: number;
    winRate?: number;
    winStreak?: number;
    maxWinStreak?: number;
    winsByAttempt?: Record<string, number>;
  } | null;
}

export default function UserStats({ stats }: UserStatsProps) {
  if (!stats) {
    return <em>No hay estadísticas disponibles.</em>;
  }

  const totalGames = stats.totalGames ?? 0;
  const victories = stats.wins ?? 0;
  const defeats = stats.losses ?? (totalGames - victories);
  const winRate = stats.winRate !== undefined ? stats.winRate.toFixed(1) : (totalGames > 0 ? ((victories / totalGames) * 100).toFixed(1) : '0.0');
  const streak = stats.winStreak ?? 0;
  const maxStreak = stats.maxWinStreak ?? 0;
  const distribucion = stats.winsByAttempt ?? { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };

  return (
    <div style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'center'}}>
      <div style={{minWidth:90,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1ed760'}}>{totalGames}</div>
        <div style={{color:'#aaa'}}>Partidas</div>
      </div>
      <div style={{minWidth:90,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1ed760'}}>{victories}</div>
        <div style={{color:'#aaa'}}>Victorias</div>
      </div>
      <div style={{minWidth:90,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#ff5252'}}>{defeats}</div>
        <div style={{color:'#aaa'}}>Derrotas</div>
      </div>
      <div style={{minWidth:90,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1ed760'}}>{winRate}%</div>
        <div style={{color:'#aaa'}}>Ratio victoria</div>
      </div>
      <div style={{minWidth:90,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1ed760'}}>{streak}</div>
        <div style={{color:'#aaa'}}>Racha actual</div>
      </div>
      <div style={{minWidth:90,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1ed760'}}>{maxStreak}</div>
        <div style={{color:'#aaa'}}>Mayor racha</div>
      </div>
      {/* Distribución de victorias por intento */}
      <div style={{minWidth:160}}>
        <div style={{color:'#1ed760',fontWeight:600,marginBottom:4}}>Victorias por intento</div>
        {['1','2','3','4','5','6'].map(n => (
          <div key={n} style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.97rem'}}>
            <span style={{width:18,display:'inline-block',color:'#fff'}}>{n}:</span>
            <div style={{background:'#1ed76033',height:12,borderRadius:6,minWidth:30,flex:1,marginRight:6}}>
              <div style={{background:'#1ed760',height:12,borderRadius:6,width:`${distribucion[n] && totalGames ? (distribucion[n]/totalGames)*100 : 0}%`}} />
            </div>
            <span style={{color:'#1ed760',fontWeight:600}}>{distribucion[n] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
