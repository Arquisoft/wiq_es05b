import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Game from '../views/Game.jsx';
import { AuthContext } from "../views/context/AuthContext.jsx";
import {MemoryRouter} from "react-router";
import { useAuth } from "../App.jsx";
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../views/context/AuthContext');
jest.mock('..')

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
        getUser: jest.fn().mockReturnValue({
            token: 'testUser',
            userId: 'test',
            username: 'test'
        }),
        isAuthenticated: jest.fn().mockReturnValue(true),
        logout: jest.fn(),
        setUser: jest.fn()
    })
}));


describe('Game component', () => {

    const mockAuth = useAuth();

    axios.get.mockImplementation((url, data) => {
        return Promise.resolve({ data: [{
                "question": {
                    "xml:lang": "en",
                    "type": "literal",
                    "value": `Question 1`
                },
                "answer": {
                    "xml:lang": "en",
                    "type": "literal",
                    "value": `Statement 2`,
                }
            }]
        });
    });

    beforeEach(() => {
        axios.post.mockReset();
    });

    it('load game', async () => {
        await act(() => render(
            <AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Game /></MemoryRouter>
            </AuthContext.Provider>
        ));

        waitFor(() => {
            expect(history.location.pathname).toBe("/account");
            expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Option 2/i)).toBeInTheDocument();
            expect(screen.getByText(/Option 3/i)).toBeInTheDocument();
            expect(screen.getByText(/Option 4/i)).toBeInTheDocument();
        })
    });
})
