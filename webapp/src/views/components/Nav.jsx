import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Box, Container, IconButton, Toolbar, Tooltip, Avatar, Button, Typography, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { ReactComponent as CustomIcon } from '../../media/logoS.svg';
import { AuthContext } from '../context/AuthContext';
import { ConfigContext } from '../context/ConfigContext';

const pages = [
    { displayed: 'Home', link: '/home', logged: false},
    { displayed: 'Menu', link: '/menu', logged: true},
    { displayed: 'Global Ranking', link: '/ranking', logged: false},
    { displayed: 'About', link: '/about', logged: false}
];

const settings = [
    { displayed: 'Account', link: '/account', logged: true },
    { displayed: 'Login', link: '/login', logged: false },
    { displayed: 'Sign Up', link: '/signup', logged: false },
    { displayed: 'Logout', link: '/logout', logged: true }
];

const threshold = 899;

const JordiButton = () => {
  const { swapConfig } = useContext(ConfigContext);

  return (
      <Button
        variant="contained"
        color="secondary"
        onClick={swapConfig}
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          marginLeft: '1rem',
          borderRadius: '50px',
          fontWeight: 'bold',
          textTransform: 'none'
        }}
      >
        Swap
      </Button>
  );
};

const MyAvatar = () => {
  const { isAuthenticated, getUser } = useContext(AuthContext)
  if (!isAuthenticated()) return <Avatar alt="Suspicious User"></Avatar>
  return (
    <Avatar alt={getUser()["username"]}>
      {getUser()["username"] ? getUser()["username"].charAt(0) : ""}
    </Avatar>
  )
}

const NavMenu = ({handleCloseNavMenu}) => {
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map((page) => {
          if (page.logged && !isAuthenticated()) return null
          return (
            <Button
              key={page.displayed}
              onClick={handleCloseNavMenu}
              component={Link}
              sx={{ my: 2, color: 'white', display: 'block' }}
              to={page.link}
            >
              {page.displayed}
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
              <MenuItem key={page.displayed} onClick={handleCloseNavMenu} component={Link} to={page.link}>
                  <Typography textAlign="center">{page.displayed}</Typography>
              </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={() => {swapConfig();handleCloseNavMenu()}}>
              <Typography textAlign="center">Swap</Typography>
          </MenuItem>
        </Menu>
    </Box>
  )
}

export default function Nav() {
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
          key={setting.displayed}
          onClick={setting.link === '/logout' ? () => {handleCloseUserMenu(); logout()} : handleCloseUserMenu}
          component={Link}
          to={setting.link === '/logout' ? "/" : setting.link}>
          <Typography textAlign="center">{setting.displayed}</Typography>
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
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MyAvatar />
              </IconButton>
            </Tooltip>
            <JordiButton />
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  
};
