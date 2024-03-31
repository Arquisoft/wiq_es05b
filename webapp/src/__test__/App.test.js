import { render, screen } from '@testing-library/react';
import App from '../index';
import {MemoryRouter} from "react-router";

test('renders learn react link', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const linkElement = screen.getByText(/Welcome to the 2024 edition of the Software Architecture course/i);
  expect(linkElement).toBeInTheDocument();
});
