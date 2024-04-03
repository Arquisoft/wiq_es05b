import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Menu from '../views/Menu.jsx';
import { useAuth } from "../App.jsx";
import { AuthContext } from "../views/context/AuthContext.jsx";
import {MemoryRouter} from "react-router";

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

describe("Menu component", () => {

    const mockAuth = useAuth();

    beforeEach(() => {
        axios.post.mockReset();
        localStorage.setItem(
            "user", {
                token:"testUser",
                userId:"test",
                username:"test"
        });
        axios.get.mockResolvedValue({
          data: ['Capitals', 'Countries', 'Languages', 'Population']
        });
    });

    test("renders component", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

      expect(screen.getByText(/Menu/i)).toBeInTheDocument();
      expect(screen.getByText(/Choose a category to play/i)).toBeInTheDocument();
      expect(screen.getByText(/Capitals/i)).toBeInTheDocument();
      expect(screen.getByText(/Countries/i)).toBeInTheDocument();
      expect(screen.getByText(/Languages/i)).toBeInTheDocument();
      expect(screen.getByText(/Population/i)).toBeInTheDocument();
    })

    test( "redirect to capitals", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const capitalsButton = screen.getByText(/Capitals/i, { selector: 'a' });

        capitalsButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/capitals");
        })
    })
})