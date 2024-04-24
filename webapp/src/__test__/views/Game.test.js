import React from 'react';
import { useState } from 'react';
import { customRender } from "../utils/customRenderer"
import { waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Game from '../../views/Game.jsx';
import { useAuth } from "../../App.jsx";
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../../views/context/AuthContext');
const render = customRender((() => useAuth())())

require("../utils/localStorageMock")()

jest.mock('../../App.jsx', () => ({
  useAuth: () => ({
    getUser: () => ({
      token: 'testToken',
      userId: 'testId',
      username: 'testUser'
    }),
    isAuthenticated: () => true,
    logout: jest.fn(),
    setUser: jest.fn()
  })
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('Game Component', () => {

  let setPoints;

  beforeEach(() => {
    setPoints = jest.fn();
    useState.mockImplementation((init) => [init, setPoints]);
    axios.get.mockReset();
    axios.post.mockReset();

    axios.post.mockImplementation((url, data) => {
      if (url.includes("/history/create")) {
        return Promise.resolve({
          data: {
            message: "Piola",
            id:
              "123"
          }
        })
      }
    })

    axios.get.mockImplementation((url, data) => {
      return Promise.resolve({
        data: [{
          "_id": "id",
          "groupId": "capitals",
          "categories": ["capitals", "geography"],
          "options": ["a", "b", "c", "d"],
          "statement": "Statement"
        }]
      });
    });
  });

  it('renders without crashing', async () => {
    await act(async () => render(<Game />));
  });

  it('renders Points component with points', async () => {
    const mockPoints = 0;
    setPoints(mockPoints);
    await act(() => render(
          <Game />
    ));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders question statement when questions are fetched', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ _id: '1', statement: 'Statement', options: ['a', 'b', 'c', 'd'] }]
    });
    await act(() => render(
          <Game />
    ));
    await waitFor(() => expect(screen.getByText('Statement')).toBeInTheDocument());
  });

  it('renders Endgame component when all questions are answered', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ _id: '1', statement: 'Test question', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] }]
    });
    axios.post.mockResolvedValueOnce({
      data: { points: 10, answer: 'Option 1' }
    });
    const history = createMemoryHistory();
    await act(() => render(
          <Router history={history}>
            <Game />
          </Router>
    ));
    await waitFor(() => screen.getByText('Option 1').click());
    await waitFor(() => expect(screen.getByText('Endgame')).toBeInTheDocument());
  });
});

