import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Login from '../views/Login.jsx';
import { AuthContext } from "../views/context/AuthContext.jsx";
import {MemoryRouter} from "react-router";
import { useAuth } from "../App.jsx";


jest.mock('axios');
jest.mock('../views/context/AuthContext');

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key],
    setItem: (key, value) => { store[key] = value },
    removeItem: key => { delete store[key] },
    clear: () => { store = {} }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Configura una implementación simulada de axios
jest.mock('../App.jsx', () => ({
  useAuth: jest.fn().mockReturnValue({
    getUser: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true),
    logout: jest.fn(),
    setUser: jest.fn()
  })
}));

const mockAuth = useAuth();

describe('Login component', () => {
  beforeEach(() => {
    axios.post.mockReset();
  });
  
  it('should log in successfully', async () => {
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter><Login /></MemoryRouter>
      </AuthContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate a successful response
    axios.post.mockResolvedValue({ data: { createdAt: '2024-01-01T12:34:56Z' } });

    // Simulate user input
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });

    waitFor(() => {
      expect(history.location.pathname).toBe("/home");
    })
  });

  it('should handle error when logging in', async () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter><Login /></MemoryRouter>
      </AuthContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Unauthorized' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

    // Verify that the user information is not displayed
    expect(screen.queryByText(/Hello testUser!/i)).toBeNull();
    expect(screen.queryByText(/Your account was created on/i)).toBeNull();
  });
});
