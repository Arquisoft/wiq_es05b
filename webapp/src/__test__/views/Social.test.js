
import { useAuth } from "../../App.jsx";
import '@testing-library/jest-dom';
import Social from '../../views/Social.jsx';
import { screen, waitFor, act } from '@testing-library/react';
import { customRender } from "../utils/customRenderer";
import React from 'react';
// import axios from "axios";

const render = customRender((() => useAuth())())
// jest.mock('axios');
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

describe('Social component', () => {

  it('load component', async () => {
    await act(async () => render(<Social />));

    waitFor(() => {
      expect(history.location.pathname).toBe("/social");
      expect(screen.getByText(/Friends/i)).toBeInTheDocument();
      expect(screen.getByText(/Requests/i)).toBeInTheDocument();
      expect(screen.getByText(/Friends Ranking/i)).toBeInTheDocument();
      expect(screen.getByText(/Search users/i)).toBeInTheDocument();
    })
  });

  it('Friends menu', async () => {
    await act(async () => render(<Social />));

    waitFor(() => {
      expect(history.location.pathname).toBe("/social");
      const friendsBt = screen.getByText(/Friends/i, {selector: "a"})
      act(() => friendsBt.click())
      waitFor(() => expect(screen.getByText(/Oops, this seems empty .../i)).toBeInTheDocument())
    })
  });

  it('Requests menu', async () => {
    await act(() => render(<Social />));

    waitFor(() => {
      expect(history.location.pathname).toBe("/social");
      const friendsBt = screen.getByText(/Requests/i, {selector: "a"})
      act(() => friendsBt.click())
      waitFor(() => expect(screen.getByText(/Oops, this seems empty .../i)).toBeInTheDocument())
    })
  });

  it('Friends ranking', async () => {
    await act(async () => render(<Social />));

    waitFor(() => {
      expect(history.location.pathname).toBe("/social");
      const friendsBt = screen.getByText(/Friends Ranking/i, {selector: "a"})
      act(() => friendsBt.click())
      waitFor(() => expect(screen.getByText(/No scores to show/i)).toBeInTheDocument())
    })
  });

  it('Friends ranking', async () => {
    await act(async () => render(<Social />));

    waitFor(() => {
      expect(history.location.pathname).toBe("/social");
      const friendsBt = screen.getByText(/Search users/i, {selector: "a"})
      act(() => friendsBt.click())
      waitFor(() => expect(screen.getByText(/Search users/i)).toBeInTheDocument())
    })
  });
})