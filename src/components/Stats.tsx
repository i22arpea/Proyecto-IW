import { Juego } from "../types/types";
import displayMenu from "../utils/displayMenu";

interface StatsProps {
  juego: Juego
}

export default function Stats({ juego }: StatsProps) {
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
      <div className="stats-container">
        <h3 className="stats-titulo">
          Estadisticas
          <button className="ayuda-salir" type="button">
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
        <a href="https://github.com/MatiasTK">MatiasTK</a>
      </footer>
    </div>
  );
}
