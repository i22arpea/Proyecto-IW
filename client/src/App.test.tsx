import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('Homepage', () => {
  it('debe mostrar el título Wordle', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /Wordle/i })).toBeInTheDocument();
  });

  it('debe mostrar el botón Go to Session Page', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /Go to Session Page/i })).toBeInTheDocument();
  });

  it('debe mostrar el componente teclado', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Busca una tecla del teclado, por ejemplo la Q
    expect(screen.getByRole('button', { name: 'Q' })).toBeInTheDocument();
  });
});
