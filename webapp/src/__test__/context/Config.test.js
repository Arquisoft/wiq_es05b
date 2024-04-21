import React from 'react';
import { render } from '@testing-library/react';
import { ConfigContext } from '../../views/context/ConfigContext';
import '@testing-library/jest-dom/extend-expect';

describe('ConfigContext', () => {
    test('creates ConfigContext', () => {
        expect(ConfigContext).toBeDefined(); // Verifica si ConfigContext está definido
    });

    test('accesses ConfigContext', () => {
        const dummyValue = { key: 'value' };

        // Renderiza un componente que consume el contexto
        const { getByText } = render(
            <ConfigContext.Provider value={dummyValue}>
                <ConfigContext.Consumer>
                    {value => <span>{value.key}</span>}
                </ConfigContext.Consumer>
            </ConfigContext.Provider>
        );

        expect(getByText(dummyValue.key)).toBeInTheDocument();
    });
});
