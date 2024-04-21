import React from 'react';
import { customRender } from "../utils/customRenderer";
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServiceDownMessage from '../../views/components/ServiceDownMessage';

const render = customRender();

describe('ServiceDownMessage component', () => {
    it('renders service down message with reason', () => {
        const grave = 'path/to/grave.png';
        const code = 503;
        const reason = 'Service Unavailable';

        render(<ServiceDownMessage grave={grave} code={code} reason={reason} />);

        const graveImage = screen.getByAltText('Grave');
        expect(graveImage).toBeInTheDocument();
        expect(graveImage).toHaveAttribute('src', grave);

        const serviceDownText = screen.getByText('The service seems to be down, please try again later.');
        expect(serviceDownText).toBeInTheDocument();

        const reasonText = screen.getByText('503: Service Unavailable');
        expect(reasonText).toBeInTheDocument();
    });

    it('renders service down message without reason', () => {
        const grave = 'path/to/grave.png';

        render(<ServiceDownMessage grave={grave} />);

        const graveImage = screen.getByAltText('Grave');
        expect(graveImage).toBeInTheDocument();
        expect(graveImage).toHaveAttribute('src', grave);

        const serviceDownText = screen.getByText('The service seems to be down, please try again later.');
        expect(serviceDownText).toBeInTheDocument();
    });
});
