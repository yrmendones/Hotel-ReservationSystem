import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Hotel as HotelIcon,
    Person as PersonIcon,
    BookOnline as BookOnlineIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Login as LoginIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Hotels', icon: <HotelIcon />, path: '/hotels' },
        { text: 'My Bookings', icon: <BookOnlineIcon />, path: '/bookings', auth: true },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', admin: true }
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Hotel Reservation
            </Typography>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    (!item.auth || isAuthenticated) && (!item.admin || isAdmin) && (
                        <ListItem
                            button
                            key={item.text}
                            component={RouterLink}
                            to={item.path}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    )
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <HotelIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            HOTEL
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {menuItems.map((item) => (
                                (!item.auth || isAuthenticated) && (!item.admin || isAdmin) && (
                                    <Button
                                        key={item.text}
                                        component={RouterLink}
                                        to={item.path}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                        startIcon={item.icon}
                                    >
                                        {item.text}
                                    </Button>
                                )
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {isAuthenticated ? (
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt={user?.name} src="/static/images/avatar/2.jpg" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem component={RouterLink} to="/profile">
                                            <ListItemIcon>
                                                <PersonIcon fontSize="small" />
                                            </ListItemIcon>
                                            <Typography textAlign="center">Profile</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <ListItemIcon>
                                                <LogoutIcon fontSize="small" />
                                            </ListItemIcon>
                                            <Typography textAlign="center">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        component={RouterLink}
                                        to="/login"
                                        color="inherit"
                                        startIcon={<LoginIcon />}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/register"
                                        color="inherit"
                                        startIcon={<PersonAddIcon />}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                    mt: '64px'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 