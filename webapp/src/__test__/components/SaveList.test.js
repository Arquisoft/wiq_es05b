import React from 'react';
import { customRender} from "../utils/customRenderer";
import {screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from "../../App.jsx";
import axios from 'axios';
import SaveList from '../../views/components/SaveList';

jest.mock('axios');
jest.mock('../../views/context/AuthContext');
require("../utils/localStorageMock")()

const render = customRender((() => useAuth())())

jest.mock('../../App.jsx', () => ({
    useAuth: () => ({
        getUser: () => ({
            token: 'mockToken',
            userId: '1',
            username: 'testUser'
        }),
        isAuthenticated: () => true,
        logout: jest.fn(),
        setUser: jest.fn()
    })
}));

describe('SaveList component', () => {
    const mockSaves = [
        {
            id: 1,
            category: 'Test Category 1',
            createdAt: '2024-04-16T10:00:00Z',
            questions: [
                { points: 10 },
                { points: 20 }
            ]
        },
        {
            id: 2,
            category: 'Test Category 2',
            createdAt: '2024-04-15T10:00:00Z',
            questions: [
                { points: 15 },
                { points: 25 }
            ]
        }
    ];

    beforeEach(() => {
        axios.mockResolvedValueOnce({ data: { saves: mockSaves, maxPages: 2 } });
        act(() => {
            render(<SaveList />);
        });
    });

    it('renders a list of saves and handles pagination', async () => {
        // Check if saves are rendered
        const saveListItems = await screen.findAllByRole('listitem');
        expect(screen.getByText('Test category 1')).toBeInTheDocument();
        expect(screen.getByText('Test category 2')).toBeInTheDocument();

        // Click on a save to display details
        fireEvent.click(saveListItems[0]);
        await waitFor(() => {
            expect(screen.getByText('30')).toBeInTheDocument();
            expect(screen.getByText('40')).toBeInTheDocument();
        });
    });

    it('renders a list of saves with correct information', async () => {
        const saveListItems = await screen.findAllByRole('listitem');

        expect(saveListItems).toHaveLength(4);

        expect(screen.getByText('Test category 1')).toBeInTheDocument();
        expect(screen.getByText('Test category 2')).toBeInTheDocument();

        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('40')).toBeInTheDocument();
    });
});
