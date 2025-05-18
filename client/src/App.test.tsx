import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('Homepage', () => {
  it('debe mostrar el título Wordle', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Wordle/i })).toBeInTheDocument();
  });

  it('debe mostrar el botón Go to Session Page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Go to Session Page/i })).toBeInTheDocument();
  });

  it('debe mostrar el componente teclado', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Q' })).toBeInTheDocument();
  });
});
