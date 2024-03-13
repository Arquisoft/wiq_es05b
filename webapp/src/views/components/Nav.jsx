import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Box, Container, IconButton, Toolbar, Tooltip, Avatar, Button, Typography, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { ReactComponent as CustomIcon } from '../../media/logoS.svg';
import { AuthContext } from '../../App';

const pages = [
  { displayed: 'Home', link: '/home' },
  { displayed: 'Ranking', link: '/ranking' },
  { displayed: 'About', link: '/about' }
];

const settings = [
  { displayed: 'Account', link: '/account', logged: true },
  { displayed: 'Sign Up', link: '/signup', logged: false },
  { displayed: 'Login', link: '/login', logged: false },
  { displayed: 'Logout', link: '/logout', logged: true }
];

export default function Nav() {
  const { user, _ } = useContext(AuthContext)
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const threshold = 899;

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const userData = JSON.parse(user)

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

  const MyAvatar = () => {
    if (!userData) return <Avatar alt="Suspicious User"></Avatar>
    return <Avatar alt={userData["username"]}>{userData["username"] ? userData["username"].charAt(0) : ""}</Avatar>
  }

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
              {settings.map((setting) => {
                let logged = false
                if(userData && userData !== "") logged = true
                if (logged !== setting.logged) return
                return (<MenuItem key={setting.displayed} onClick={handleCloseUserMenu} component={Link} to={setting.link}>
                  <Typography textAlign="center">{setting.displayed}</Typography>
                </MenuItem>)
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
  
};
