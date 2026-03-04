import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    alpha,
    Paper,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Psychology as PracticeIcon,
    EmojiEvents as DailyIcon,
    History as HistoryIcon,
    Leaderboard as LeaderboardIcon,
    VideoChat as MockIcon,
    Logout as LogoutIcon,
    Psychology as PsychologyIcon
} from '@mui/icons-material';
import type { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import ErrorBoundary from '../ErrorBoundary';
import ThemeToggle from '../ThemeToggle';
import NotificationMenu from '../NotificationMenu';
import NotificationToast from '../NotificationToast';

const drawerWidth = 280;

const MainLayout: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        dispatch(logout());
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Practice Hub', icon: <PracticeIcon />, path: '/practice' },
        { text: 'Daily Challenge', icon: <DailyIcon />, path: '/daily' },
        { text: 'Mock Interview', icon: <MockIcon />, path: '/mock-interview' },
        { text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
        { text: 'History', icon: <HistoryIcon />, path: '/history' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ px: 3, py: 4 }}>
                <Typography
                    variant="h5"
                    className="gradient-text"
                    sx={{
                        letterSpacing: -1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}
                >
                    <Box sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                    }}>
                        <PsychologyIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    AI PREP
                </Typography>
            </Toolbar>

            <List sx={{ px: 2, flexGrow: 1, mt: 2 }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                            <ListItemButton
                                selected={isSelected}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                sx={{
                                    borderRadius: '14px',
                                    py: 1.75,
                                    px: 2.5,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&.Mui-selected': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                        color: 'primary.main',
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.18),
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                            transform: 'scale(1.1) translateX(2px)',
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '25%',
                                            height: '50%',
                                            width: 4,
                                            borderRadius: '0 4px 4px 0',
                                            backgroundColor: 'primary.main',
                                            boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                                        }
                                    },
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.text.primary, 0.04),
                                        transform: 'translateX(4px)',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 42,
                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isSelected ? 800 : 600,
                                        fontSize: '0.925rem',
                                        letterSpacing: isSelected ? '0.01em' : '0'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 2, mb: 2 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1)
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                        USER PROFILE
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem',
                            fontWeight: 700
                        }}>
                            {user?.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography noWrap variant="body2" sx={{ fontWeight: 700 }}>
                                {user?.name}
                            </Typography>
                            <Typography noWrap variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                Pro Member
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={handleLogout} sx={{ ml: 'auto', color: 'text.secondary' }}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }} className="mesh-bg">
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                            Empowering Your Next Career Move
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <NotificationMenu />
                        <ThemeToggle />
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />
                        <IconButton
                            onClick={handleMenu}
                            sx={{
                                p: 0.5,
                                border: '2px solid',
                                borderColor: 'primary.main',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        >
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 34,
                                height: 34,
                                fontSize: '0.9rem',
                                fontWeight: 800
                            }}>
                                {user?.name?.charAt(0)}
                            </Avatar>
                        </IconButton>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 180,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                '& .MuiMenuItem-root': {
                                    px: 2,
                                    py: 1.25,
                                    borderRadius: 1,
                                    mx: 1,
                                    my: 0.5,
                                    fontSize: '0.875rem'
                                }
                            }
                        }}
                    >
                        <MenuItem disabled sx={{ opacity: '1 !important' }}>
                            <Box sx={{ py: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Account Info</Typography>
                                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                            </Box>
                        </MenuItem>
                        <Divider sx={{ my: 1 }} />
                        <MenuItem onClick={() => navigate('/history')}>My History</MenuItem>
                        <MenuItem onClick={() => navigate('/leaderboard')}>Leaderboard</MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxShadow: 'none',
                        },
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
                    p: { xs: 2, sm: 3, md: 4 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                    maxWidth: '1400px',
                    mx: 'auto'
                }}
            >
                <Box className="animate-fade-in">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </Box>
            </Box>
            <NotificationToast />
        </Box>
    );
};

export default MainLayout;
