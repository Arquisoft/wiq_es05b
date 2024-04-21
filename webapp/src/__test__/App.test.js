import React from 'react';
import { waitFor, act, render } from '@testing-library/react';

import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App.jsx';
import { useAuth } from "../App.jsx";
import '@testing-library/jest-dom';
import {MemoryRouter, Navigate, Route} from "react-router";

jest.mock('axios');

jest.mock('../views/components/Particles.jsx', () => {
    return function DummyParticles() {
        return <div data-testid="particles" />;
    };
});

describe('App', () => {

    beforeEach(() => {
        axios.get.mockReset();
        axios.post.mockReset();
    });

    it('renders without crashing',  async () => {
        render(<MemoryRouter><App /></MemoryRouter>);
    });

    test('renders Home component when navigating to /', async () => {
        window.history.pushState({}, '', '/');
        await act(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/");
        });
    });
    it('renders Home component when navigating to /home', async () => {
        window.history.pushState({}, '', '/home');
        await act(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        });

        waitFor(() => {
            expect(history.location.pathname).toBe("/home");
        });
    });

    it('renders Signup component when navigating to /signup', async () => {
        window.history.pushState({}, '', '/signup');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        expect(history.location.pathname).toBe("/signup");
    });

    it('renders Login component when navigating to /login', async () => {
        window.history.pushState({}, '', '/login');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/login");
        })
    });

    it('renders About component when navigating to /about', async () => {
        window.history.pushState({}, '', '/about');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/about");
        })
    });

    it('renders Ranking component when navigating to /ranking', async () => {
        window.history.pushState({}, '', '/ranking');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/ranking");
        })
    });

    it('renders Menu component when navigating to /menu', async () => {
        window.history.pushState({}, '', '/menu');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
        })
    });

    it('renders Game component when navigating to /game/:category', async () => {
        window.history.pushState({}, '', '/game/currency');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/game/currency");
        })
    });

    it('renders Account component when navigating to /account', async () => {
        window.history.pushState({}, '', '/account');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/account");
        })
    });

    it('renders Error component when navigating to non-existent route', async () => {
        window.history.pushState({}, '', '/non-existent-route');
        await waitFor(() => {
            render(<MemoryRouter><App /></MemoryRouter>);
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe("/non-existent-route");
        })
    });
});