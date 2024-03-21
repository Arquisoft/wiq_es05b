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
})