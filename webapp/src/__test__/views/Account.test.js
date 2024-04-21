import React from 'react';
import { customRender } from "../utils/customRenderer";
import { screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Account from '../../views/Account.jsx';
import { useAuth } from "../../App.jsx";
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../../views/context/AuthContext');
require("../utils/localStorageMock")()

const render = customRender((() => useAuth())())

// Configura una implementación simulada de axios
jest.mock('../../App.jsx', () => ({
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

    beforeEach(() => {
        axios.post.mockReset();
    });

    it('load account', async () => {
        await act(() => render(<Account />));

        waitFor(() => {
            expect(history.location.pathname).toBe("/account");
            expect(screen.getByText(/History/i)).toBeInTheDocument();
            expect(screen.getByText(/User data/i)).toBeInTheDocument();
            expect(screen.getByText(/test/i)).toBeInTheDocument();
        })
    });
})