import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Ranking from '../views/Ranking';

jest.mock('axios');

describe('Ranking', () => {
    test('renders global ranking components', async () => {
        const mockData = [
            { user: 'User1', category: 'Category1', totalTime: 10, totalPoints: 100, correct: 0.9, date: new Date() },
            { user: 'User2', category: 'Category2', totalTime: 20, totalPoints: 200, correct: 0.8, date: new Date() }
        ];
        axios.get.mockResolvedValue({ data: mockData });

        render(<Ranking />);
        await waitFor(() => {
            expect(screen.getByText('User1')).toBeInTheDocument();
            expect(screen.getByText('User2')).toBeInTheDocument();
        });

        expect(screen.getByText('Global Ranking')).toBeInTheDocument();
        expect(screen.getByLabelText('Filter')).toBeInTheDocument();
    });

});
