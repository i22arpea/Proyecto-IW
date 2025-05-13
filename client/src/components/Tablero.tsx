export default function Board() {
  function renderSquare(i: number) {
    return <button aria-label="square" className="square" type="button" value={i} />;
  }

  return (
    <main className="board-flex">
      <div className="board">
        <div className="fila">
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="fila">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
          {renderSquare(9)}
          {renderSquare(10)}
        </div>
        <div className="fila">
          {renderSquare(11)}
          {renderSquare(12)}
          {renderSquare(13)}
          {renderSquare(14)}
          {renderSquare(15)}
        </div>
        <div className="fila">
          {renderSquare(16)}
          {renderSquare(17)}
          {renderSquare(18)}
          {renderSquare(19)}
          {renderSquare(20)}
        </div>
        <div className="fila">
          {renderSquare(21)}
          {renderSquare(22)}
          {renderSquare(23)}
          {renderSquare(24)}
          {renderSquare(25)}
        </div>
        <div className="fila">
          {renderSquare(26)}
          {renderSquare(27)}
          {renderSquare(28)}
          {renderSquare(29)}
          {renderSquare(30)}
        </div>
      </div>
    </main>
  );
}
