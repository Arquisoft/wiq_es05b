import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Account from '../views/Account.jsx';
import { AuthContext } from "../views/context/AuthContext.jsx";
import {MemoryRouter} from "react-router";
import { useAuth } from "../App.jsx";
import '@testing-library/jest-dom';

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

describe('Account component', () => {

    const mockAuth = useAuth();

    beforeEach(() => {
        axios.post.mockReset();
    });

    it('load account', async () => {
        await act(() => render(
            <AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Account /></MemoryRouter>
            </AuthContext.Provider>
        ));

        waitFor(() => {
            expect(history.location.pathname).toBe("/account");
            expect(screen.getByText(/History/i)).toBeInTheDocument();
            expect(screen.getByText(/User data/i)).toBeInTheDocument();
            expect(screen.getByText(/test/i)).toBeInTheDocument();
        })
    });
})