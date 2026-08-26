import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import api from '../api/axios';

jest.mock('../api/axios');

test('shows loading text initially', () => {
  // api waits  to check loading state
  (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));
  
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
  
  let loadingText = screen.getByText(/Loading notes.../i);
  expect(loadingText).toBeInTheDocument();
});

test('shows empty state when api returns no notes', async () => {
  // return empty array
  (api.get as jest.Mock).mockResolvedValueOnce({
    data: { success: true, data: [] }
  });

  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
  });
});

test('renders notes correctly from api', async () => {
  // dummy data for testing
  let dummyNotes = [
    {
      _id: '123',
      title: 'My First Full Stack Note',
      content: '<p>Testing NoteFlow dashboard</p>',
      createdAt: '2026-08-26T12:00:00Z'
    }
  ];

  (api.get as jest.Mock).mockResolvedValueOnce({
    data: { success: true, data: dummyNotes }
  });

  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  // wait for note title to show 
  await waitFor(() => {
    expect(screen.getByText('My First Full Stack Note')).toBeInTheDocument();
  });
});