// Returns a new state to avoid breaking react rules.
export default function llenarArray(juego) {
    const newState = { ...juego };

    const square = document.querySelectorAll('.square');
    const newArray = [];

    for (let i = 0; i < square.length; i++) {
        const content = square[i].textContent;

        if (content) {
            newArray.push(content);
        } else {
            newArray.push('');
        }
    }

    newState.estadoActual = newArray;

    return newState;
}
