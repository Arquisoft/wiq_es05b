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

// FIXME

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
jest.mock('../App.jsx', () => ({
    useAuth: () => ({
        getUser: () => ({
            token: 'testToken',
            userId: 'testId',
            username: 'testUser'
        }),
        isAuthenticated: () => true,
        logout: jest.fn(),
        setUser: jest.fn()
    })
}));

describe('Game Component', () => {
    const mockAuth = useAuth();

    axios.post.mockImplementation((url, data) => {
        return Promise.resolve({data: {categories: "categoria", statement: 'Question 1', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']}});
    });

    beforeEach(() => {
        axios.post.mockReset();
    });

    it('renders without crashing',  async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Game /></MemoryRouter>
            </AuthContext.Provider>)
        });
    });
});

