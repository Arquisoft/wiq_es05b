import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import Endgame from '../views/Endgame';

describe('Endgame', () => {
    test('renders endgame components with correct props', () => {
        const points = 100;
        const correct = 8;
        const wrong = 2;
        const time = 120;

        render(
            <MemoryRouter>
                <Endgame points={points} correct={correct} wrong={wrong} time={time} />
            </MemoryRouter>
        );

        expect(screen.getByAltText('Ou yea')).toBeInTheDocument();
        expect(screen.getByText('Game result')).toBeInTheDocument();
        expect(screen.getByText(`Total points: ${points}`)).toBeInTheDocument();
        expect(screen.getByText(`Correct answers: ${correct}`)).toBeInTheDocument();
        expect(screen.getByText(`Wrong answers: ${wrong}`)).toBeInTheDocument();
        expect(screen.getByText(`Total time: ${time} s`)).toBeInTheDocument();
        const goHomeButton = screen.getByText('Go Home');
        fireEvent.click(goHomeButton);
        waitFor(() => {
            expect(history.location.pathname).toBe("/home");
        })
    });

});
