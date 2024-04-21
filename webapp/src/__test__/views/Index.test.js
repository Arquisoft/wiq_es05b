import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from '../../App';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');
jest.mock('../../views/components/Particles.jsx', () => {
    return function DummyParticles() {
        return <div data-testid="particles" />;
    };
});
describe('App Component', () => {
    it('renders without crashing', async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
    });

    it('axios base URL is set correctly', () => {
        waitFor(() => {
            expect(history.location.pathname).toBe("/home");
        })
    });
    it('renders the header with navigation links', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Global Ranking/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Swap/i })).toBeInTheDocument();
        expect(screen.getByTestId('particles')).toBeInTheDocument();
    });

});
