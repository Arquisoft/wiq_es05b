import React from 'react';
import { customRender } from "./utils/customRenderer"
import { act } from '@testing-library/react';
import axios from 'axios';
import Game from '../views/Game.jsx';
import { useAuth } from "../App.jsx";
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../views/context/AuthContext');

require("./utils/localStorageMock")()

jest.mock('../App.jsx', () => ({
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

const render = customRender(useAuth())
describe('Game Component', () => {

  beforeEach(() => {
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
});

