import React from 'react';
import { customRender } from "../utils/customRenderer";
import '@testing-library/jest-dom';
import ServiceDownMessage from '../../views/components/ServiceDownMessage';

const render = customRender();

describe('ServiceDownMessage', () => {
    test('renders service down message without reason', () => {
        const { getByText, getByAltText } = render(<ServiceDownMessage grave="grave.jpg" />);
        expect(getByText('The service seems to be down, please try again later.')).toBeInTheDocument();
        expect(getByAltText('Grave')).toBeInTheDocument();
    });

    test('renders service down message with reason', () => {
        const { getByText } = render(<ServiceDownMessage grave="grave.jpg" code="404" reason="Service Not Found" />);
        expect(getByText('The service seems to be down, please try again later.')).toBeInTheDocument();
        expect(getByText('404: Service Not Found')).toBeInTheDocument();
    });
});