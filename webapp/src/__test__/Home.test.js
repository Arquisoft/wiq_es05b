import React from 'react';
import { customRender } from "./utils/customRenderer";
import { screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Home from '../views/Home.jsx';

const mockAxios = new MockAdapter(axios);
const render = customRender();

describe("Home component", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders component", async () => {
        render(<Home />);

        await act(async () => {});

        expect(screen.getByText(/Play/)).toBeInTheDocument();
    })

    test( "redirect to login", async () => {
        render(<Home />);

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