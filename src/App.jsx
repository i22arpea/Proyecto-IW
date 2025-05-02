import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Board from './components/Tablero';
import Header from './components/Header';
import Help from './components/Ayuda';
import Keyboard from './components/Teclado';
import Settings from './components/Opciones';
import Stats from './components/Stats';
import { encriptarPalabra } from './libs/crypto';
import cargarSettings from './utils/cargarOpciones';
import keyPress from './utils/presionarTecla';
import llenarArray from './utils/llenarArray';
import recuperarStats from './utils/recuperarStats';
import words from './json/palabras_5.json';

export default function App() {
    const [juego, setJuego] = useState({
        position: 1,
        row: 1,
        dificil: false,
        modoOscuro: true,
        modoDaltonico: false,
        dailyWord: encriptarPalabra(words[Math.floor(Math.random() * words.length)]),
        juegoFinalizado: false,
        jugadas: 0,
        victorias: 0,
        distribucion: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            X: 0,
        },
        estadoActual: [],
        streak: 0,
        maxStreak: 0,
        hardModeMustContain: [],
    });

    useEffect(() => {
        function getLastData() {
            const rawData = localStorage.getItem('juego');
            if (!rawData) {
                console.log('No saved data');
                return;
            }

            const savedData = JSON.parse(rawData);

            if (savedData) {
                let newState = {
                    dificil: savedData.dificil,
                    modoOscuro: savedData.modoOscuro,
                    modoDaltonico: savedData.modoDaltonico,
                    dailyWord: savedData.dailyWord,
                    distribucion: savedData.distribucion,
                    estadoActual: savedData.estadoActual,
                    jugadas: 0,
                    victorias: 0,
                    juegoFinalizado: false,
                    row: 1,
                    position: 1,
                    streak: 0,
                    maxStreak: 0,
                    hardModeMustContain: [],
                };

                if (savedData.estadoActual[0] && savedData.estadoActual[0] !== '') {
                    for (let i = 0; i < savedData.estadoActual.length; i++) {
                        if (savedData.estadoActual[i] !== '') {
                            newState = keyPress(savedData.estadoActual[i], newState);
                            if ((i + 1) % 5 === 0) {
                                newState = llenarArray(newState);
                                newState = keyPress('Enter', newState);
                            }
                        }
                    }
                }

                newState = recuperarStats(newState);
                setJuego(newState);
            }
        }

        getLastData();
    }, []);

    useEffect(() => {
        function listenKeydown(e) {
            let newState = keyPress(e.key, juego);
            if (e.key === 'Enter') {
                newState = llenarArray(newState);
            }
            setJuego(newState);
        }

        document.addEventListener('keydown', listenKeydown);
        cargarSettings(juego);

        return () => document.removeEventListener('keydown', listenKeydown);
    }, [juego]);

    useEffect(() => {
        localStorage.setItem('juego', JSON.stringify(juego));
    }, [juego]);

    return (
        <div className="game">
            <div className="game-main">
                <Header juego={juego} setJuego={setJuego} />
                <Board />
                <Keyboard juego={juego} setJuego={setJuego} />
            </div>
            <div className="game-help hidden scale-up-center">
                <Help />
            </div>
            <div className="game-stats hidden scale-up-center">
                <Stats juego={juego} />
            </div>
            <div className="game-settings hidden scale-up-center">
                <Settings juego={juego} setJuego={setJuego} />
            </div>
            <div className="game-session hidden scale-up-center">
                <Settings juego={juego} setJuego={setJuego} />
            </div>
            <ToastContainer limit={3} />
        </div>
    );
}
