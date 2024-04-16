import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Menu from '../views/Menu.jsx';
import { AuthContext } from "../views/context/AuthContext";
import {MemoryRouter} from "react-router";
import { useAuth } from "../App.jsx";
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../views/context/AuthContext');

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: key => store[key],
        setItem: (key, value) => { store[key] = value },
        removeItem: key => { delete store[key] },
        clear: () => { store = {} }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Configura una implementación simulada de axios
jest.mock('../App.jsx', () => ({
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

describe('Menu component', () => {

    const mockAuth = useAuth();

    beforeEach(() => {
        axios.post.mockReset();
    });

    it('load game menu', async () => {

        await act(() => render(
            <AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>
        ));
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const categoryButtons = screen.getAllByRole('button');
            expect(categoryButtons).toHaveLength(11);
            const expectedCategories = [
                'Area', 'Capitals', 'Continent', 'Currency', 'Economy', 'Gdp', 'Geography', 'Languages', 'Politics', 'Population', 'President'
            ];
            expectedCategories.forEach((category, index) => {
                expect(categoryButtons[index]).toHaveTextContent(category);
            });
        })
    });

    test( "redirect to capitals", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const capitalsButton = screen.getByText(/Capitals/i, { selector: 'a' });
            act(() => {
                capitalsButton.click();
            });
            act(async () => {});

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/capitals");
            })
        })
    })

    test( "redirect to area", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
        const areaButton = screen.getByText(/Area/i, { selector: 'a' });

        areaButton.click();

        act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/area");
        })
        })
    })

    test( "redirect to continent", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const continentButton = screen.getByText(/Continent/i, {selector: 'a'});

            continentButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/continent");
            })
        })
    })

    test( "redirect to currency", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const currencyButton = screen.getByText(/Currency/i, {selector: 'a'});

            currencyButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/currency");
            })
        })
    })

    test( "redirect to economy", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const economyButton = screen.getByText(/Economy/i, {selector: 'a'});

            economyButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/economy");
            })
        })
    })

    test( "redirect to gdp", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const gdpButton = screen.getByText(/gdp/i, {selector: 'a'});

            gdpButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/gdp");
            })
        })
    })

    test( "redirect to geography", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const geographyButton = screen.getByText(/Geography/i, {selector: 'a'});

            geographyButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/geography");
            })
        })
    })

    test( "redirect to languages", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const languagesButton = screen.getByText(/Languages/i, {selector: 'a'});

            languagesButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/languages");
            })
        })
    })

    test( "redirect to politics", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const politicsButton = screen.getByText(/Politics/i, {selector: 'a'});

            politicsButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/politics");
            })
        })
    })

    test( "redirect to population", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const populationButton = screen.getByText(/Population/i, {selector: 'a'});

            populationButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/population");
            })
        })
    })


    test( "redirect to president", async () => {
        await act(async () => {
            render(<AuthContext.Provider value={mockAuth}>
                <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
        });
        waitFor(() => {
            expect(history.location.pathname).toBe("/menu");
            const presidentButton = screen.getByText(/President/i, {selector: 'a'});

            presidentButton.click();

            act(async () => {
            });

            waitFor(() => {
                expect(history.location.pathname).toBe("/game/president");
            })
        })
    })
});
