import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('Homepage', () => {
  it('debe renderizar la homepage correctamente', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Busca un texto que siempre esté en la homepage, por ejemplo el título
    expect(screen.getByText(/Wordle/i)).toBeInTheDocument();
  });
});
