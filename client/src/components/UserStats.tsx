import React from 'react';

interface GameHistory {
  won: boolean;
  attemptsUsed: number;
}

interface UserStatsProps {
  history: GameHistory[];
}

export default function UserStats({ history }: UserStatsProps) {
  if (!history || history.length === 0) {
    return <em>No hay estadísticas disponibles.</em>;
  }

  const totalGames = history.length;
  const victories = history.filter(g => g.won).length;
  const defeats = totalGames - victories;
  const winRate = ((victories / totalGames) * 100).toFixed(1);
  const avgAttempts = (
    victories > 0
      ? (history.filter(g => g.won).reduce((acc, g) => acc + g.attemptsUsed, 0) / victories)
      : 0
  ).toFixed(2);

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
      <div style={{minWidth:120,textAlign:'center'}}>
        <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1ed760'}}>{avgAttempts}</div>
        <div style={{color:'#aaa'}}>Intentos medios (victoria)</div>
      </div>
    </div>
  );
}
