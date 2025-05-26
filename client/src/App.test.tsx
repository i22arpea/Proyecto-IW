import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders the main heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Main Heading/i);
    expect(headingElement).toBeInTheDocument();
});
