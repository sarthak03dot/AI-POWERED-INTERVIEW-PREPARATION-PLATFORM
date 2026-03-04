import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    alpha,
    useTheme,
    Tooltip
} from '@mui/material';
import { NotificationsOutlined, Circle as CircleIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead, removeNotification, clearNotifications } from '../redux/slices/uiSlice';
import { formatDistanceToNow } from 'date-fns';
import type { RootState } from '../redux/store';

const NotificationMenu: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { notifications } = useSelector((state: RootState) => state.ui);
    const unreadCount = notifications.filter(n => !n.read).length;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        dispatch(markAllAsRead());
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton
                    onClick={handleClick}
                    sx={{
                        color: 'text.secondary',
                        bgcolor: alpha(theme.palette.divider, 0.05),
                        '&:hover': {
                            bgcolor: alpha(theme.palette.divider, 0.1),
                            color: theme.palette.primary.main
                        }
                    }}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsOutlined />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 320,
                        maxHeight: 400,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={800}>Notifications</Typography>
                    {notifications.length > 0 && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                                cursor: 'pointer',
                                fontWeight: 700,
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => dispatch(clearNotifications())}
                        >
                            Clear all
                        </Typography>
                    )}
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">All caught up!</Typography>
                    </Box>
                ) : (
                    notifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={() => dispatch(markAsRead(notif.id))}
                            sx={{
                                py: 2,
                                px: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                bgcolor: notif.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '&:last-child': { borderBottom: 0 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                                {!notif.read && <CircleIcon sx={{ fontSize: 8, color: 'primary.main', mr: 1 }} />}
                                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ flexGrow: 1 }}>{notif.title}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.4
                            }}>
                                {notif.message}
                            </Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationMenu;
