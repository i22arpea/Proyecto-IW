import React from 'react'
import { Juego } from '../types/types'
import keyPress from '../utils/presionarTecla'
import llenarArray from '../utils/llenarArray'

interface KeyboardProps {
  juego: Juego
  setJuego: React.Dispatch<React.SetStateAction<Juego>>
  children?: React.ReactNode // Added children to props
}

function Keyboard({ juego, setJuego, children }: KeyboardProps) { // Destructure children
  function renderKey(i: string) {
    return (
      <button
        className="key"
        id={i}
        type="button"
        onClick={() => {
          const newState = keyPress(i, juego)

          setJuego(newState)
        }}
      >
        {i}
      </button>
    )
  }

  return (
    <div className="keyboard">
      {children} {/* Render children if provided */}
      <div className="fila-keyboard">
        {renderKey('Q')}
        {renderKey('W')}
        {renderKey('E')}
        {renderKey('R')}
        {renderKey('T')}
        {renderKey('Y')}
        {renderKey('U')}
        {renderKey('I')}
        {renderKey('O')}
        {renderKey('P')}
      </div>
      <div className="fila-keyboard">
        {renderKey('A')}
        {renderKey('S')}
        {renderKey('D')}
        {renderKey('F')}
        {renderKey('G')}
        {renderKey('H')}
        {renderKey('J')}
        {renderKey('K')}
        {renderKey('L')}
        {renderKey('Ñ')}
      </div>
      <div className="fila-keyboard">
        <button
          className="key key-special enter"
          type="button"
          onClick={() => {
            let newState = keyPress('Enter', juego)

            newState = llenarArray(newState)
            setJuego(newState)
          }}
        >
          ENVIAR
        </button>
        {renderKey('Z')}
        {renderKey('X')}
        {renderKey('C')}
        {renderKey('V')}
        {renderKey('B')}
        {renderKey('N')}
        {renderKey('M')}
        <button
          aria-label="Cerrar ayuda"
          className="key key-special"
          type="button"
          onClick={() => {
            const newState = keyPress('Backspace', juego)

            setJuego(newState)
          }}
        >
          <svg
            className="icon icon-tabler icon-tabler-backspace"
            fill="none"
            height="24"
            stroke="#f5f5f5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" stroke="none" />
            <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
            <path d="M12 10l4 4m0 -4l-4 4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

Keyboard.defaultProps = {
  children: undefined,
};

export default Keyboard
