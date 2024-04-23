import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Box, Container, IconButton, Toolbar, Tooltip, Button, Typography, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { ReactComponent as CustomIcon } from '../../media/logoS.svg';
import { AuthContext } from '../context/AuthContext';
import { ConfigContext } from '../context/ConfigContext';
import MyAvatar from "./MyAvatar"
import {LocaleContext} from "../context/LocaleContext"

const pages = [
    { code: 'home_home', link: '/home', logged: false},
    { code: 'home_menu', link: '/menu', logged: true},
    { code: 'home_ranking', link: '/ranking', logged: false},
    { code: 'home_about', link: '/about', logged: false}
];

const settings = [
    { code: 'home_menu_account', link: '/account', logged: true },
    { code: 'home_menu_login', link: '/login', logged: false },
    { code: 'home_menu_sign_up', link: '/signup', logged: false },
    { code: 'home_menu_logout', link: '/logout', logged: true }
];

const locale = [
  { code: "i18n_spanish", value: "es" },
  { code: "i18n_english", value: "en" },
]

const threshold = 899;

const JordiButton = () => {
  const { swapConfig } = useContext(ConfigContext);
  const { t } = useContext(LocaleContext)

  return (
      <Button
        variant="contained"
        color="secondary"
        onClick={swapConfig}
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          borderRadius: '50px',
          fontWeight: 'bold',
          textTransform: 'none'
        }}
      >
        {t("nav_button_swap")}
      </Button>
  );
};

const NavMenu = ({handleCloseNavMenu}) => {
  const { t } = useContext(LocaleContext)
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map((page) => {
          if (page.logged && !isAuthenticated()) return null
          return (
            <Button
              key={page.code}
              onClick={handleCloseNavMenu}
              component={Link}
              sx={{ my: 2, color: 'white', display: 'block' }}
              to={page.link}
            >
              {t(page.code)}
            </Button>
          )
        })}
    </Box>
  )
}

const NavIcon = ({width}) => (
  <Link style={{ margin: width > threshold ? '0.5rem' : '1rem auto' }} to="/home">
      <CustomIcon />
  </Link>
);

const DropDownMenu = ({handleCloseNavMenu, anchorElNav, setAnchorElNav}) => {
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const { swapConfig } = useContext(ConfigContext);
  const { t } = useContext(LocaleContext)
  return (
    <Box sx={{ flexGrow: { md: 1 }, display: { xs: 'flex', md: 'none' }, width: { xs: 'fit-content' } }}>
        <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {pages.map((page) => (
              <MenuItem key={page.code} onClick={handleCloseNavMenu} component={Link} to={page.link}>
                  <Typography textAlign="center">{t(page.code)}</Typography>
              </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={() => {swapConfig();handleCloseNavMenu()}}>
              <Typography textAlign="center">{t("nav_button_swap")}</Typography>
          </MenuItem>
        </Menu>
    </Box>
  )
}

const LocaleMenu = () => {
  const {locale: l, setLocale, t} = useContext(LocaleContext)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        onClick={handleClick}
        sx={{ my: 2,
          color: 'white',
          display: { xs: 'none', md: 'inline-flex' },
        }}
        variant="outlined"
        color="secondary"
        startIcon={<KeyboardArrowDownIcon />}
      >
        {l}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {locale.map((l) =>
          <MenuItem
            key={l.code}
            onClick={() => { handleClose(); setLocale(l.value) }}>
            <Typography textAlign="center">{t(l.code)}</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default function Nav() {
  const { t } = useContext(LocaleContext)
  const { isAuthenticated, logout } = useContext(AuthContext)
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleWindowResize = () => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);
    return () => window.removeEventListener('resize', handleResizeWindow);
  }

  useEffect(handleWindowResize, [])

  const generateMenuItems = () => {
    return settings.map((setting) => {
      if (isAuthenticated() !== setting.logged) return null
      return (
        <MenuItem
          key={setting.code}
          onClick={setting.link === '/logout' ? () => {handleCloseUserMenu(); logout()} : handleCloseUserMenu}
          component={Link}
          to={setting.link === '/logout' ? "/" : setting.link}>
          <Typography textAlign="center">{t(setting.code)}</Typography>
        </MenuItem>
      )
    })
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DropDownMenu
            handleCloseNavMenu={handleCloseNavMenu}
            anchorElNav={anchorElNav}
            setAnchorElNav={setAnchorElNav}
          />
          <NavIcon width={width} />
          <NavMenu handleCloseNavMenu={handleCloseNavMenu} />
          <Box sx={{ flexGrow: 0, display: "flex", flexFlow: "row", alignItems: "center", gap: "1rem" }}>
            <Tooltip title="User profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MyAvatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {generateMenuItems()}
            </Menu>
            <LocaleMenu />
            <JordiButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  
};
