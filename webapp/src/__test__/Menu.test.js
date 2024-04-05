import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Menu from '../views/Menu.jsx';
import { useAuth } from "../App.jsx";
import { AuthContext } from "../views/context/AuthContext.jsx";
import {MemoryRouter} from "react-router";

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
    getUser: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true),
    logout: jest.fn(),
    setUser: jest.fn()
  })
}));

describe("Menu component", () => {

    const mockAuth = useAuth();

    beforeEach(() => {
        axios.post.mockReset();
        localStorage.setItem(
            "user", {
                token:"testUser",
                userId:"test",
                username:"test"
        });
        axios.get.mockResolvedValue({
          data: ['Area', 'Capitals', 'Continent', 'Currency', 'Economy', 'Gdp', 'Geography', 'Languages', 'Politics', 'Population', 'President']
        });
    });

    test("renders component", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

      expect(screen.getByText(/Menu/i)).toBeInTheDocument();
      expect(screen.getByText(/Choose a category to play/i)).toBeInTheDocument();
      expect(screen.getByText(/Area/i)).toBeInTheDocument();
      expect(screen.getByText(/Capitals/i)).toBeInTheDocument();
      expect(screen.getByText(/Continent/i)).toBeInTheDocument();
      expect(screen.getByText(/Currency/i)).toBeInTheDocument();
      expect(screen.getByText(/Economy/i)).toBeInTheDocument();
      expect(screen.getByText(/Gdp/i)).toBeInTheDocument();
      expect(screen.getByText(/Geography/i)).toBeInTheDocument();
      expect(screen.getByText(/Languages/i)).toBeInTheDocument();
      expect(screen.getByText(/Politics/i)).toBeInTheDocument();
      expect(screen.getByText(/Population/i)).toBeInTheDocument();
      expect(screen.getByText(/President/i)).toBeInTheDocument();
    })

    test( "redirect to capitals", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const capitalsButton = screen.getByText(/Capitals/i, { selector: 'a' });

        capitalsButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/capitals");
        })
    })

    test( "redirect to area", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const areaButton = screen.getByText(/Area/i, { selector: 'a' });

        areaButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/area");
        })
    })

    test( "redirect to continent", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const continentButton = screen.getByText(/Continent/i, { selector: 'a' });

        continentButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/continent");
        })
    })

    test( "redirect to currency", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const currencyButton = screen.getByText(/Currency/i, { selector: 'a' });

        currencyButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/currency");
        })
    })

    test( "redirect to economy", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const economyButton = screen.getByText(/Economy/i, { selector: 'a' });

        economyButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/economy");
        })
    })

    test( "redirect to gdp", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const gdpButton = screen.getByText(/gdp/i, { selector: 'a' });

        gdpButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/gdp");
        })
    })

    test( "redirect to geography", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const geographyButton = screen.getByText(/Geography/i, { selector: 'a' });

        geographyButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/geography");
        })
    })

    test( "redirect to languages", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const languagesButton = screen.getByText(/Languages/i, { selector: 'a' });

        languagesButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/languages");
        })
    })

    test( "redirect to politics", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
          <MemoryRouter><Menu /></MemoryRouter>
        </AuthContext.Provider>);
      });

        const politicsButton = screen.getByText(/Politics/i, { selector: 'a' });

        politicsButton.click();

        await act(async () => {});

        waitFor(() => {
            expect(history.location.pathname).toBe("/game/politics");
        })
    })

    test( "redirect to population", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
              <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
      });
    
        const populationButton = screen.getByText(/Population/i, { selector: 'a' });
    
        populationButton.click();
    
        await act(async () => {});
    
        waitFor(() => {
            expect(history.location.pathname).toBe("/game/population");
        })
    })
    

    test( "redirect to president", async () => {
      await act(async () => {
        render(<AuthContext.Provider value={mockAuth}>
              <MemoryRouter><Menu /></MemoryRouter>
            </AuthContext.Provider>);
      });
    
        const presidentButton = screen.getByText(/President/i, { selector: 'a' });
    
        presidentButton.click();
    
        await act(async () => {});
    
        waitFor(() => {
            expect(history.location.pathname).toBe("/game/president");
        })
    })
})
