import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders the main heading', async () => {
    render(<App />);
    const headingElement = await screen.findByText(/Main Heading/i);
    expect(headingElement).toBeInTheDocument();
});
