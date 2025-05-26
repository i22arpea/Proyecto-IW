import React, { useEffect, useState } from 'react';
import { Juego } from "../types/types.d"; // Fixed import path
import displayMenu from "../utils/desplegarMenu";

interface StatsProps {
  juego: Juego;
  children?: React.ReactNode; // Added children to props
}

interface GameHistory {
  _id: string;
  secretWord: string;
  won: boolean;
  attemptsUsed: number;
  createdAt: string;
}

export default function Stats({ juego, children }: StatsProps) {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/Proyecto-IW/api/stats/usuarios/historial', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudo cargar el historial');
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al cargar el historial de partidas');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  function renderDistribution(index: string) {
    const porcentaje: number = (juego.distribucion[index] * 100) / juego.jugadas;
    const chart = document.getElementById(`d-${index}`);

    if (chart) {
      chart.style.width = `${(porcentaje / 10).toFixed(0)}rem`;
    }

    return (
      <div className="stats-fila">
        <p className="stats-fila-numero">{index}:</p>
        <div className="stats-squares">
          <dd className="percentage" id={`d-${index}`} />
          {porcentaje ? `${porcentaje.toFixed(0)}%` : 'No hay datos'}
        </div>
      </div>
    );
  }

  return (
    <div className="stats">
      {children} {/* Render children if provided */}
      <div className="stats-container">
        <h3 className="stats-titulo">
          Estadisticas
          <button aria-label="Cerrar ayuda" className="ayuda-salir" type="button">
            <svg
              className="icon icon-tabler icon-tabler-x"
              fill="none"
              height="24"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => displayMenu('.game-stats')}
            >
              <path d="M0 0h24v24H0z" fill="none" stroke="none" />
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </h3>
        <div className="stats-main">
          <div className="stats-stats">
            <div className="stats-jugadas">
              <p className="stats-numero">{juego.jugadas}</p>
              <p className="stats-texto">Jugadas</p>
            </div>
            <div className="victorias">
              <p className="stats-numero">
                {(juego.victorias ? (juego.victorias * 100) / juego.jugadas : 0).toFixed(0)}%
              </p>
              <p className="stats-texto">Victorias</p>
            </div>
            <div className="stats-jugadas">
              <p className="stats-numero">{juego.streak}</p>
              <p className="stats-texto">Racha actual</p>
            </div>
            <div className="stats-jugadas">
              <p className="stats-numero">{juego.maxStreak}</p>
              <p className="stats-texto">Mayor Racha</p>
            </div>
          </div>
          <h3 className="stats-titulo">Distribucion</h3>
          <div className="stats-distribucion">
            <div className="stats-distribucion-center">
              {renderDistribution('1')}
              {renderDistribution('2')}
              {renderDistribution('3')}
              {renderDistribution('4')}
              {renderDistribution('5')}
              {renderDistribution('6')}
              {renderDistribution('X')}
            </div>
          </div>
          <h3 className="stats-titulo" style={{marginTop:32}}>Historial de partidas</h3>
          <div style={{color:'#fff',marginBottom:24}}>
            {loading && <div style={{color:'#1ed760'}}>Cargando historial...</div>}
            {error && <div style={{color:'#ff5252'}}>{error}</div>}
            {!loading && !error && history.length === 0 && <em>No hay partidas registradas.</em>}
            {!loading && !error && history.length > 0 && (
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
                  {history.map((g) => {
                    const { _id: id, secretWord, won, attemptsUsed, createdAt } = g;
                    return (
                      <tr key={id}>
                        <td style={{padding:'6px 4px'}}>{new Date(createdAt).toLocaleString()}</td>
                        <td style={{padding:'6px 4px'}}>{secretWord.toUpperCase()}</td>
                        <td style={{padding:'6px 4px',textAlign:'center'}}>{attemptsUsed}</td>
                        <td style={{padding:'6px 4px',color: won ? '#1ed760' : '#ff5252',fontWeight:600}}>{won ? 'Victoria' : 'Derrota'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <footer className="footer-ayuda">
        <svg
          className="icon icon-tabler icon-tabler-brand-github"
          fill="none"
          height="20"
          stroke="#a3a3a3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </svg>
        <a href="https://github.com/i22arpea/Proyecto-IW">Proyecto-IW</a>
      </footer>
    </div>
  );
}

Stats.defaultProps = {
  children: undefined,
};
