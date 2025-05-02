// Returns a new state to avoid breaking react rules.

export default function recuperarStats(juego) {
    const data = localStorage.getItem('juego');
    let lastGame = juego;

    if (data) {
        const parse = JSON.parse(data);

        lastGame = {
            ...juego,
            victorias: parse.victorias,
            distribucion: parse.distribucion,
            jugadas: parse.jugadas,
            streak: parse.streak,
            maxStreak: parse.maxStreak,
            position: parse.position,
            row: parse.row,
        };
    }

    return lastGame;
}
