import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
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

//  check if signup form render
test('renders signup form properly', () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={fakeContext}>
        <SignUp />
      </AuthContext.Provider>
    </BrowserRouter>
  );
  
  expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
});

// test validation errors 
test('shows errors when form is submitted empty', async () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={fakeContext}>
        <SignUp />
      </AuthContext.Provider>
    </BrowserRouter>
  );
  
  let submitBtn = screen.getByRole('button', { name: /Sign Up/i });
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(screen.getByText(/Name must be at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });
});

// test successful registration api call 
test('calls signup api with correct data', async () => {
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
        <SignUp />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  // fill  input fields with test data
  fireEvent.change(screen.getByLabelText(/Full Name/i), {
    target: { value: 'Sania Ali' },
  });
  fireEvent.change(screen.getByLabelText(/Email Address/i), {
    target: { value: 'sania@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^Password/i), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
    target: { value: 'password123' },
  });

  // submit form
  fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  // verify if aPi called
  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Sania Ali',
      email: 'sania@example.com',
      password: 'password123',
    });
    expect(mockLoginFn).toHaveBeenCalled();
  });
});