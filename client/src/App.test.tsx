import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Homepage', () => {
  it('debe mostrar el título Wordle', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Wordle/i })).toBeInTheDocument();
  });

