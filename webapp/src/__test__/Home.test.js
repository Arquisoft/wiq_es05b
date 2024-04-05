import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Home from '../views/Home.jsx';
import {MemoryRouter} from "react-router";

const mockAxios = new MockAdapter(axios);

describe("Home component", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders component", async () => {
        render(<MemoryRouter><Home /></MemoryRouter>);

        await act(async () => {});

        expect(screen.getByText(/Play/)).toBeInTheDocument();
    })

    test( "redirect to login", async () => {
        render(<MemoryRouter><Home /></MemoryRouter>);

        const playButton = screen.getByText(/Play/i, { selector: 'a' });
        act(() => {
        playButton.click();
        });
        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/login");
        })
    })
})