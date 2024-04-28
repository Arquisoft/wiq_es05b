import React from 'react';
import { customRender } from "../utils/customRenderer";
import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Signup from '../../views/Signup.jsx';
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

describe('Signup component', () => {

  beforeEach(() => {
    axios.post.mockReset();
  });
  
  it('should sign up successfully', async () => {
    
    await act(() => render(<Signup />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByRole('button');

    // Mock the axios.post request to simulate a successful response
    axios.post.mockResolvedValue({ data: { createdAt: '2024-01-01T12:34:56Z' } });

    // Simulate user input
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(signUpButton);
      });

    waitFor(() => {
      expect(history.location.pathname).toBe("/home");
    })
  });

  it('should handle error when sign in (no special character)', async () => {
    await act(() => render(<Signup />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByRole('button');

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Password must contain at least one special character' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword123' } });

    // Trigger the login button click
    fireEvent.click(signUpButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Password must contain at least one special character/i)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(history.location.pathname).toBe("/signup");
    })
  });

  it('should handle error when sign in (no upper case)', async () => {
    await act(() => render(<Signup />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByRole('button');

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Password must contain at least one uppercase letter' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword123$' } });

    // Trigger the login button click
    fireEvent.click(signUpButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(history.location.pathname).toBe("/signup");
    })
  });

  it('should handle error when sign in (no number)', async () => {
    await act(() => render(<Signup />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByRole('button');

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Password must contain at least one number' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword%' } });

    // Trigger the login button click
    fireEvent.click(signUpButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Password must contain at least one number/i)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(history.location.pathname).toBe("/signup");
    })
  });

  it('should handle error when sign in (length)', async () => {
    await act(() => render(<Signup />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByRole('button');

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Password must be at least 8 characters long' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'tes' } });

    // Trigger the login button click
    fireEvent.click(signUpButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Password must be at least 8 characters long/i)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(history.location.pathname).toBe("/signup");
    })
  });

  it('should handle error when sign in (repeated user)', async () => {
    await act(() => render(<Signup />));

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpButton = screen.getByRole('button');

    // Mock the axios.post request to simulate an error response
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Username already exists' }
      }
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword123$' } });

    // Trigger the login button click
    fireEvent.click(signUpButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Username already exists/i)).toBeInTheDocument();
    });

    waitFor(() => {
      expect(history.location.pathname).toBe("/signup");
    })
  });
});
