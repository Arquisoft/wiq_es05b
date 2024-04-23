import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import defaultTheme from "../../views/components/config/defaultTheme.json"
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../views/context/AuthContext.jsx";
import {LocaleContext} from "../../views/context/LocaleContext";
import "../../scripts/i18next"
import localeEn from "../../locals/en.json"
import localeEs from "../../locals/es.json"

const theme = createTheme(defaultTheme);
const mockSetLocale = jest.fn();

const mockT = (key, { lng } = { lng: 'en' }) => {
  const resources = { en: localeEn, es: localeEs };
  return resources[lng]["translation"][key] || key;
};

const customRender = (authContextValue={}) => (ui, options) =>
  render(ui, { wrapper: props =>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authContextValue}>
          <LocaleContext.Provider value={{ locale: 'en', setLocale: mockSetLocale, t: key => mockT(key) }}>>
            <MemoryRouter>
              {props.children}
            </MemoryRouter>
          </LocaleContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>, ...options });

export { customRender };