import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import JordiAsk from '../jordiask-service';

const mockAxios = new MockAdapter(axios);

describe('JordiAsk component', () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    it('should start game successfully', async () => {

    });
})