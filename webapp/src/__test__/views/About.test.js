import React from 'react';
import { customRender } from "../utils/customRenderer";
import { screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import About from '../../views/About.jsx';

const mockAxios = new MockAdapter(axios);
const render = customRender();

describe("About component", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders component", async () => {
        render(<About />);

        await act(async () => {});
        const aboutUs = screen.getByText('About Us').closest('.MuiPaper-root');
        expect(aboutUs).toBeInTheDocument();
        expect(screen.getByText(/Thank you for visiting!/)).toBeInTheDocument();
        expect(screen.getByText(/Welcome to our project! We are dedicated to providing quality content and services to our users./)).toBeInTheDocument();
        expect(screen.getByText(/Our mission is to provide a fun way of learning and practicing general knowledge through a Q&A game./)).toBeInTheDocument();
        expect(screen.getByText(/Feel free to explore our site and discover more about what we have to offer./)).toBeInTheDocument();
        expect(screen.getByText(/If you have any questions or feedback, please don't hesitate to contact us./)).toBeInTheDocument();
        const contactUsSection = screen.getByText('Contact Us').closest('.MuiPaper-root');
        expect(contactUsSection).toBeInTheDocument();
        expect(screen.getByText(/You can reach us via the following channels:/)).toBeInTheDocument();

    })

})