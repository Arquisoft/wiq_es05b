import React from "react";
import {render, screen, fireEvent, act} from "@testing-library/react";
import Nav from "../../views/components/Nav";
import {AuthContext} from "../../views/context/AuthContext";
import {MemoryRouter} from "react-router";
import { useAuth } from "../../App.jsx";

jest.mock('axios');
jest.mock('../../views/context/AuthContext');

require("../utils/localStorageMock");

jest.mock('../../App.jsx', () => ({
    useAuth: jest.fn().mockReturnValue({
        getUser: jest.fn().mockReturnValue({
            token: 'testUser',
            userId: 'test',
            username: 'test'
        }),
        isAuthenticated: jest.fn().mockReturnValue(true),
        logout: jest.fn(),
        setUser: jest.fn()
    })
}));

describe("Nav component", () => {
    const mockAuth = useAuth();
    test("renders navigation links", async () => {
        await act(() => render(
            <AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Nav/></MemoryRouter>
            </AuthContext.Provider>
        ));
        const homeLink = screen.getByText("Home");
        const menuLink = screen.getByText("Menu");
        const aboutLink = screen.getByText("About");
        const globalRankingLink = screen.getByText("Global Ranking");

        expect(homeLink).toBeInTheDocument();
        expect(menuLink).toBeInTheDocument();
        expect(aboutLink).toBeInTheDocument();
        expect(globalRankingLink).toBeInTheDocument();
    });

    test("opens user menu on click", async() => {
        await act(() => render(
            <AuthContext.Provider value={mockAuth}>
                    <MemoryRouter><Nav/></MemoryRouter>
            </AuthContext.Provider>
        ));
        const avatarButton = screen.getByLabelText("Open settings");
        fireEvent.click(avatarButton);
        const accountMenuItem = screen.getByText("Account");
        const logoutMenuItem = screen.getByText("Logout");

        expect(accountMenuItem).toBeInTheDocument();
        expect(logoutMenuItem).toBeInTheDocument();
    });
});
