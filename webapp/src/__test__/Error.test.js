import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Error from '../views/Error.jsx';
import { useAuth } from "../App.jsx";
import { AuthContext } from "../views/context/AuthContext.jsx";
import {MemoryRouter} from "react-router";
import Menu from "../views/Menu";

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

jest.mock('../App.jsx', () => ({
    useAuth: jest.fn().mockReturnValue({
        getUser: jest.fn(),
        isAuthenticated: jest.fn().mockReturnValue(true),
        logout: jest.fn(),
        setUser: jest.fn()
    })
}));
describe('Error component', () => {
    const mockAuth = useAuth();
    it('renders error message and button',  async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Error/></MemoryRouter>
            </AuthContext.Provider>);
        });
        const errorImage = screen.getByAltText('Oh no');
        expect(errorImage).toBeInTheDocument();
        expect(errorImage).toHaveAttribute('src', '/jordi-error.jpg');
        expect(screen.getByText(/Oh no, an error occurred/i)).toBeInTheDocument();
        expect(screen.getByText(/It seems the requested URL does no exist or you don't have enough privileges to see it/i)).toBeInTheDocument();
        expect(screen.getByText(/Go back sinner/i)).toBeInTheDocument();
        const goHomeButton = screen.getByText(/Go Home/);
        expect(goHomeButton).toBeInTheDocument();
        expect(goHomeButton).toHaveAttribute('href', '/home');
    });
});
