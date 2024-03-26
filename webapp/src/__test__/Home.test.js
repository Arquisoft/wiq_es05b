import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../views/Home.jsx';
import {MemoryRouter} from "react-router";

describe("Home component", () => {

    test("renders component", async () => {
        render(<MemoryRouter><Home /></MemoryRouter>);

        await act(async () => {});

        expect(screen.getByText(/Play/)).toBeInTheDocument();
    })

    test( "redirect to login", async () => {
        render(<MemoryRouter><Home /></MemoryRouter>);

        const playButton = screen.getByText(/Play/i, { selector: 'a' });

        await act(async () => {
            fireEvent.click(playButton);
        } );


        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
    })
})