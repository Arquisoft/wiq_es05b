import React from 'react';
import {waitFor, render, act} from '@testing-library/react';
import axios from 'axios';
import App from '../App.jsx';
import {useAuth} from "../App.jsx";
import '@testing-library/jest-dom';
import {MemoryRouter} from "react-router";

jest.mock('axios');
jest.mock('../views/context/AuthContext');
require("./utils/localStorageMock")()


jest.mock('../views/components/Particles.jsx', () => {
  return function DummyParticles() {
    return <div data-testid="particles" />;
  };
});

describe('App', () => {
  beforeEach(() => {
      axios.get.mockReset()
      axios.post.mockReset()
      axios.get.mockImplementation((url, _) => {
        if (url.includes("validate"))
          return Promise.resolve({data: {valid: true}})
        if(url.includes("/game/categories"))
          return Promise.resolve({data: ["a", "b", "c"]})
        if(url.includes("/ranking"))
          return Promise.resolve({data: []})
        if(url.includes("/game/questions"))
          return Promise.resolve({data: []})
        if(url.includes("/user"))
          return Promise.resolve({data: {}})
        if(url.includes("/history/get"))
          return Promise.resolve({data: {saves: [], maxPages: 0}})
      })
      axios.post.mockImplementation((url, _) => {
        if(url.includes("/history/create"))
          return Promise.resolve({data: { id: "1" }})
      })
    }
  )

  it('renders without crashing', async () => {
    await act(() => render(<MemoryRouter><App /></MemoryRouter>));
  });

  test('renders Home component when navigating to /', async () => {
    await tryToRender("/");
  });
  it('renders Home component when navigating to /home', async () => {
    await tryToRender("/home");
  });

  it('renders Signup component when navigating to /signup', async () => {
    await tryToRender("/signup");
  });

  it('renders Login component when navigating to /login', async () => {
    await tryToRender("/login");
  });

  it('renders About component when navigating to /about', async () => {
    await tryToRender("/about");
  });

  it('renders Ranking component when navigating to /ranking', async () => {
    await tryToRender("/ranking");
  });

  it('renders Menu component when navigating to /menu', async () => {
    await tryToRender("/menu");
  });

  it('renders Game component when navigating to /game/:category', async () => {
    await tryToRender("/game/currency");
  });

  it('renders Account component when navigating to /account', async () => {
      await tryToRender("/account");
  });

  it('renders Error component when navigating to non-existent route', async () => {
      await tryToRender("/non-existent-route");
  });
});

const tryToRender = async (path) => {
  window.history.pushState({}, '', path);
  await act(() => {
    render(
      <MemoryRouter initialEntries={[path]} initialIndex={0}>
        <App />
      </MemoryRouter>
    );
  })
  await waitFor(() => {
    expect(window.location.pathname).toBe(path);
  });
}