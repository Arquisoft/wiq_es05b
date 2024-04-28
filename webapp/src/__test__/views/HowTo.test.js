import React from 'react';
import { customRender } from "../utils/customRenderer";
import { screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HowTo from '../../views/HowToPlay.jsx';

const mockAxios = new MockAdapter(axios);
const render = customRender();

describe("HowTo component", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders component", async () => {
        render(<HowTo />);

        await act(async () => {});
        const gameGuide = screen.getByText('Game guide').closest('.MuiPaper-root');
        expect(gameGuide).toBeInTheDocument();
        expect(screen.getByText(/Game guide/)).toBeInTheDocument();
        expect(screen.getByText(/To start playing, you first need to log in or register. Once logged in, selecting the play button allows you to choose from various categories/)).toBeInTheDocument();
        expect(screen.getByText(/You can enable or disable hot questions,a feature that adds one random question worth double points/)).toBeInTheDocument();
        expect(screen.getByText(/You'll have 20 seconds to answer each question, earning 100 points for a correct answer, losing 10 points for a wrong answer, and gaining 0 points for leaving it blank./)).toBeInTheDocument();
        expect(screen.getByText(/After 10 questions, you'll see a summary of the game/)).toBeInTheDocument();

        const loginGuide = screen.getByText('How to navigate').closest('.MuiPaper-root');
        expect(loginGuide).toBeInTheDocument();
        expect(screen.getByText(/Game guide/)).toBeInTheDocument();
        expect(screen.getByText(/To access your profile, you must click on the icon with the first letter of your username, and then go to the section: 'Account'/)).toBeInTheDocument();
        expect(screen.getByText(/To log out, you must click on the same icon, and then go to the section: 'Log out'/)).toBeInTheDocument();
        expect(screen.getByText(/To access a specific game from your history, after accessing your profile, simply click on the desired game for its breakdown/)).toBeInTheDocument();;
        expect(screen.getByText(/There are also several added options such as adding friends or viewing a global ranking available on the top navigation bar./)).toBeInTheDocument();
    })

})