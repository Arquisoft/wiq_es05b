import React from 'react';
import { customRender } from "./utils/customRenderer"
import { screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Error from '../views/Error.jsx';
import { useAuth } from "../App.jsx";

jest.mock('axios');
jest.mock('../views/context/AuthContext');
require("./utils/localStorageMock")()

const render = customRender(useAuth())

jest.mock('../App.jsx', () => ({
    useAuth: jest.fn().mockReturnValue({
        getUser: jest.fn(),
        isAuthenticated: jest.fn().mockReturnValue(true),
        logout: jest.fn(),
        setUser: jest.fn()
    })
}));
describe('Error component', () => {
    it('renders error message and button',  async () => {
        await act(async () => render(<Error/>));
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
