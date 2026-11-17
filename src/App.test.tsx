import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => window.localStorage.clear());

test('renders the task dashboard and seeded tasks', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /make room for good work/i })).toBeInTheDocument();
  expect(screen.getByText('Review Q4 product roadmap')).toBeInTheDocument();
});

test('adds a task and can mark it complete', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('New task title'), { target: { value: 'Prepare weekly notes' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
  expect(screen.getByText('Prepare weekly notes')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Complete Prepare weekly notes' }));
  fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
  expect(screen.getByText('Prepare weekly notes')).toBeInTheDocument();
});
