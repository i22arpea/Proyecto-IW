import React from 'react'
import { Juego } from '../types/types'
import displayMenu from '../utils/displayMenu'
import llenarArray from '../utils/llenarArray'
import restartGame from '../utils/restartGame'

interface HeaderProps {
  juego: Juego
  setJuego: React.Dispatch<React.SetStateAction<Juego>>
}

export default function Header({ juego, setJuego }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <svg
          className="icon icon-tabler icon-tabler-help"
          fill="none"
          height="24"
          stroke="#525252"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => displayMenu('.game-help')}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <circle cx="12" cy="12" r="9" />
          <line x1="12" x2="12" y1="17" y2="17.01" />
          <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
        </svg>
        <svg
          className="icon icon-tabler icon-tabler-refresh"
          fill="none"
          height="24"
          stroke="#424242"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            const newState = restartGame(juego)

            llenarArray(newState)
            setJuego(newState)
          }}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
      </div>
      <h1 className="titulo">Wordle</h1>
      <div>
        <svg
          className="icon icon-tabler icon-tabler-chart-bar"
          fill="none"
          height="24"
          stroke="#525252"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => displayMenu('.game-stats')}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <rect height="8" rx="1" width="6" x="3" y="12" />
          <rect height="12" rx="1" width="6" x="9" y="8" />
          <rect height="16" rx="1" width="6" x="15" y="4" />
          <line x1="4" x2="18" y1="20" y2="20" />
        </svg>
        <svg
          className="icon icon-tabler icon-tabler-settings"
          fill="none"
          height="24"
          stroke="#525252"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => displayMenu('.game-settings')}
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </header>
  )
}
