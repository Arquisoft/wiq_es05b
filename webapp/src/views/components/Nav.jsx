import React, { useState, useEffect } from 'react';
import { AppBar, Box, Container, IconButton, Toolbar, Tooltip, Avatar, Button, Typography, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { ReactComponent as CustomIcon } from '../../media/logoS.svg';

const pages = [
  { displayed: 'Home', link: '/home' },
  { displayed: 'Ranking', link: '/ranking' },
  { displayed: 'About', link: '/about' }
];

const settings = [
  { displayed: 'Account', link: '/account' },
  { displayed: 'Sign Up', link: '/signup' },
  { displayed: 'Login', link: '/login' },
  { displayed: 'Logout', link: '/logout' }
];

export default function Nav() {

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const threshold = 899;

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);
    return () => window.removeEventListener('resize', handleResizeWindow);
  }, []);

  const NavIcon = () => (
    <div style={{ margin: width > threshold ? '1rem 2rem' : '1rem auto' }}>
      <CustomIcon />
    </div>
  );

  const DropDownMenu = () => (
    <Box sx={{ flexGrow: { md: 1 }, display: { xs: 'flex', md: 'none' }, width: { xs: 'fit-content' } }}>
      <IconButton size="large" aria-label="account of current user" onClick={handleOpenNavMenu} color="inherit">
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
      </Menu>
    </Box>
  );

  const NavMenu = () => (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button key={page.displayed} onClick={handleCloseNavMenu} component={Link} sx={{ my: 2, color: 'white', display: 'block' }} to={page.link}>
          {page.displayed}
        </Button>
      ))}
    </Box>
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DropDownMenu />
          <NavIcon />
          <NavMenu />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Jordi Hurtado" src="https://i.imgur.com/rnFjdQJ.jpeg" />
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
              {settings.map((setting) => (
                <MenuItem key={setting.displayed} onClick={handleCloseUserMenu} component={Link} to={setting.link}>
                  <Typography textAlign="center">{setting.displayed}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  
};
