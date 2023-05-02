import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './Wordle';

test('renders wordle', () => {
  render(<App />);
  const wordleElement = screen.getByText(/Wordle/i);
  const customElement = screen.getByText(/(custom edition)/i);
  expect(wordleElement).toBeInTheDocument();
  expect(customElement).toBeInTheDocument();
});
