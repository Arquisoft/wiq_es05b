import AppBar from "@mui/material/AppBar";
import {
  Box, Button, Collapse,
  Container, Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText, Menu, MenuItem, Tooltip, Typography
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import { ReactComponent as CustomIcon } from '../../media/logoS.svg';
import {LocaleContext} from "../context/LocaleContext";
import {AuthContext} from "../context/AuthContext";
import PublicIcon from '@mui/icons-material/Public';
import InfoIcon from '@mui/icons-material/Info';
import WidgetsIcon from '@mui/icons-material/Widgets';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MyAvatar from "./MyAvatar";
import {ConfigContext} from "../context/ConfigContext";

const pages = [
  {code: 'home_home', link: '/home', logged: false, icon: HomeIcon},
  {code: 'home_menu', link: '/menu', logged: true, icon: WidgetsIcon},
  {code: 'home_ranking', link: '/ranking', logged: false, icon: PublicIcon},
  {code: 'home_about', link: '/about', logged: false, icon: InfoIcon},
  {code: 'howto_title', link: '/howTo', logged: false, icon: InfoIcon}

];

const settings = [
  {code: 'home_menu_account', link: '/account', logged: true, icon: AccountCircleIcon},
  {code: 'home_menu_login', link: '/login', logged: false, icon: LoginIcon},
  {code: 'home_menu_sign_up', link: '/signup', logged: false, icon: PersonAddIcon},
  {code: 'home_menu_logout', link: '/logout', logged: true, icon: LogoutIcon},
];

const locale = [
  {code: "i18n_spanish", value: "es"},
  {code: "i18n_english", value: "en"},
]

const localeToText = (id) => locale.find(x => x.value === id).code

const threshold = 899;

const listGenerator = (data, t, isAuthenticated, setOpen, logout) => {
  return (
    <List>
      {
        data.map(item => {
          if(item.logged !== isAuthenticated) return null
          const f = item.link === '/logout' ? () => {setOpen(false); logout()} : () => setOpen(false)
          return (
            <ListItemButton component={Link} to={item.link} onClick={f} key={item.code} disablePadding>
              { item.icon && <ListItemIcon>
                  <item.icon />
                </ListItemIcon> }
              <ListItemText primary={t(item.code)} />
            </ListItemButton>
          )
        })
      }
    </List>
  )
}

const NavIcon = ({width}) => (
  <Link style={{ margin: width > threshold ? '0.5rem' : '1rem auto' }} to="/home">
    <CustomIcon />
  </Link>
);

const LeftDrawer = () => {
  const { t, setLocale } = useContext(LocaleContext)
  const { isAuthenticated, logout } = useContext(AuthContext)
  const { swapConfig } = useContext(ConfigContext);
  const [open, setOpen] = useState(false)
  const {locale: l} = useContext(LocaleContext)
  const [openLocale, setOpenLocale] = useState(false)

  return (
    <Box sx={{ flexGrow: { md: 1 }, display: { xs: 'flex', md: 'none' }, width: { xs: 'fit-content' } }}>
      <IconButton size="large" color="inherit" onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box>
          {listGenerator(pages, t, isAuthenticated(), setOpen, logout)}
        </Box>
        <Divider />
        <Box>
          <List>
            <ListItemButton onClick={swapConfig} disablePadding>
              <ListItemIcon>
                <SwapHorizIcon />
              </ListItemIcon>
              <ListItemText primary={t("nav_button_swap")} />
            </ListItemButton>
          </List>
        </Box>
        <Divider />
        <Box>
          <List>
            <ListItemButton onClick={() => setOpenLocale(!openLocale)} disablePadding>
              <ListItemIcon>
                {openLocale ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </ListItemIcon>
              <ListItemText primary={t(localeToText(l))} />
            </ListItemButton>
            <Collapse in={openLocale} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {locale.map(l => {
                  return (
                    <ListItemButton key={l.code} onClick={() => {setOpenLocale(false); setOpen(false); setLocale(l.value)}} disablePadding>
                      <ListItemText primary={t(l.code)} />
                    </ListItemButton>
                  )
                })}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

const UserIcon = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useContext(AuthContext)
  const { t } = useContext(LocaleContext)

  return (
    <>
      <Tooltip title="User profile">
        <IconButton sx={{ p: 0 }} onClick={() => setOpen(true)} >
          <MyAvatar />
        </IconButton>
      </Tooltip>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box>
          {listGenerator(settings, t, isAuthenticated(), setOpen)}
        </Box>
      </Drawer>
    </>
  )
}

const RightDrawer = () => {
  return (
    <Box sx={{ flexGrow: 0, display: "flex", flexFlow: "row", alignItems: "center", gap: "1rem" }}>
      <UserIcon />
      <LocaleMenu />
      <JordiButton />
    </Box>
  )
}

const LocaleMenu = () => {
  const {locale: l, setLocale, t} = useContext(LocaleContext)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const url = useLocation()
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
        startIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        disabled={/\/game\/*/.test(url.pathname)}
      >
        {l}
      </Button>
      <Menu
        sx={{ marginTop: '1rem' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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

const Links = () => {
  const { t } = useContext(LocaleContext)
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => {
        if (page.logged && !isAuthenticated()) return null
        return (
          <Button
            key={page.code}
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

const Nav = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowResize = () => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);
    return () => window.removeEventListener('resize', handleResizeWindow);
  }
  useEffect(handleWindowResize, [])

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LeftDrawer />
          <NavIcon width={width} />
          <Links />
          <RightDrawer />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Nav