import React from 'react';
import { customRender } from "./utils/customRenderer";
import {fireEvent, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Endgame from '../views/Endgame';

const render = customRender()

describe('Endgame', () => {
    test('renders endgame components with correct props', () => {
        const points = 100;
        const correct = 8;
        const wrong = 2;
        const time = 120;

        render(<Endgame points={points} correct={correct} wrong={wrong} time={time} />);

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
