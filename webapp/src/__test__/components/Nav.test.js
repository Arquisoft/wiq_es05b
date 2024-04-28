import React from 'react';
import { customRender } from "../utils/customRenderer";
import {screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import Nav from '../../views/components/Nav.jsx';
import { useAuth } from "../../App.jsx";
import '@testing-library/jest-dom';
import { ConfigContext } from '../../views/context/ConfigContext';

jest.mock('axios');
jest.mock('../../views/context/AuthContext');

require("../utils/localStorageMock")()

const render = customRender((() => useAuth())())

jest.mock('../../App.jsx', () => ({
    // Mock de useAuth
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

describe('Nav component', () => {
    beforeEach(() => {
        axios.post.mockReset();
    });

    test('renders menu items correctly', async () => {
        const mockSwapConfig = jest.fn();
        render(
            <ConfigContext.Provider value={{ swapConfig: mockSwapConfig }}>
                <Nav />
            </ConfigContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Global Ranking/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();

        });
    });

});
