import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DATANO navigation logo', () => {
  render(<App />);
  const logoElement = screen.getByText('DATANO');
  expect(logoElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('About')).toBeInTheDocument();
});
