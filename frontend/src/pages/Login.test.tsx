import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

jest.mock('../api/axios');

// fake data for testing
const mockLoginFn = jest.fn();
const fakeContext = {
  user: null,
  token: null,
  login: mockLoginFn,
  logout: jest.fn(),
  isAuthenticated: false,
  isInitialized: true,
};

test('renders login form properly', () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={fakeContext}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
  
  expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
});

test('shows errors when form is submitted empty', async () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={fakeContext}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
  
  let submitBtn = screen.getByRole('button', { name: /Sign In/i });
  fireEvent.click(submitBtn);

  // wait for validation messages
  await waitFor(() => {
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });
});

test('calls login api with correct data', async () => {
  // setup fake response
  (api.post as jest.Mock).mockResolvedValueOnce({
    data: {
      _id: '123',
      name: 'Sania Ali',
      email: 'sania@example.com',
      token: 'fake-jwt-token'
    }
  });

  render(
    <BrowserRouter>
      <AuthContext.Provider value={fakeContext}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  // fill the form
  fireEvent.change(screen.getByLabelText(/Email Address/i), {
    target: { value: 'sania@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: 'password123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  // check if api called
  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'sania@example.com',
      password: 'password123',
    });
    expect(mockLoginFn).toHaveBeenCalled();
  });
});