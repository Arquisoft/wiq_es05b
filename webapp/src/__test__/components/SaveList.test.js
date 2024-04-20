import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import SaveList from '../../views/components/SaveList';
import { AuthContext } from "../../views/context/AuthContext";
import { MemoryRouter } from "react-router";

jest.mock('axios');
jest.mock('../../views/context/AuthContext');
require("../utils/localStorageMock")()

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
        render(
            <AuthContext.Provider value={{ getUser: jest.fn().mockReturnValue({ userId: 1, token: 'mockToken' }) }}>
                <MemoryRouter>
                    <SaveList />
                </MemoryRouter>
            </AuthContext.Provider>
        );
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

});
