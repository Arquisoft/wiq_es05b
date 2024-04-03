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
        localStorage.setItem("user", "testUser");
    });

    test("renders component", async () => {
        render(<MemoryRouter><Home /></MemoryRouter>);

        await act(async () => {});

        expect(screen.getByText(/Menu/i)).toBeInTheDocument();
        expect(screen.getByText(/Choose a category to play/i)).toBeInTheDocument();
        expect(screen.getByText(/Capitals/i)).toBeInTheDocument();
        expect(screen.getByText(/Countries/i)).toBeInTheDocument();
        expect(screen.getByText(/Languages/i)).toBeInTheDocument();
        expect(screen.getByText(/Population/i)).toBeInTheDocument();
    })

    test( "redirect to capitals", async () => {
        render(<MemoryRouter><Home /></MemoryRouter>);

        const capitalsButton = screen.getByText(/Capitals/i, { selector: 'a' });

        capitalsButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/capitals");
        })
    })
})