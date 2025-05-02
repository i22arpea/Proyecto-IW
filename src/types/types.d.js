const Juego = {
    position: 0,
    row: 1,
    dificil: false,
    modoOscuro: false,
    modoDaltonico: false,
    dailyWord: '',
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
};



// Si necesitas manipular objetos de manera dinámica o agregar nuevos objetos,
// se puede hacer de forma sencilla sin tener que definir estrictamente sus estructuras.

// Ejemplo de cómo podrías trabajar con el objeto 'Juego':
Juego.position = 1;
Juego.row = 2;
Juego.distribucion[1] = 5;// Accediendo a un valor específico en la distribución

export default Juego;
