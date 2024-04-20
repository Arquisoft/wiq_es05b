import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import defaultTheme from "../../views/components/config/defaultTheme.json"
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../views/context/AuthContext.jsx";

const theme = createTheme(defaultTheme);

const customRender = (authContextValue={}) => (ui, options) =>
  render(ui, { wrapper: props =>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authContextValue}>
          <MemoryRouter>
            {props.children}
          </MemoryRouter>
        </AuthContext.Provider>
      </ThemeProvider>, ...options });

export { customRender };