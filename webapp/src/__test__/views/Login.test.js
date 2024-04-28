import React from 'react';
import {customRender} from "../utils/customRenderer";
import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Login from '../../views/Login.jsx';
import { useAuth } from "../../App.jsx";
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../../views/context/AuthContext');
require("../utils/localStorageMock")()

const render = customRender((() => useAuth())())

// Configura una implementación simulada de axios
jest.mock('../../App.jsx', () => ({
  useAuth: jest.fn().mockReturnValue({
    getUser: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true),
    logout: jest.fn(),
    setUser: jest.fn()
  })
}));

describe('Login component', () => {

  beforeEach(() => {
    axios.post.mockReset();
  });
  
  it('should log in successfully', async () => {
    
    await act(() => render(<Login />));

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
    await act(() => render(<Login />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Invalid credentials' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Invalid credentials/i)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(history.location.pathname).toBe("/login");
    })
  });
});
