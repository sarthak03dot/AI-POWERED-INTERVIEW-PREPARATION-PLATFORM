import React from 'react';
import { IconButton, useTheme, Tooltip, alpha } from '@mui/material';
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/uiSlice';
import type { RootState } from '../redux/store';

const ThemeToggle: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: RootState) => state.ui);

    return (
        <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
                onClick={() => dispatch(toggleTheme())}
                sx={{
                    color: 'text.secondary',
                    bgcolor: alpha(theme.palette.divider, 0.05),
                    width: 42,
                    height: 42,
                    borderRadius: 3,
                    '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        transform: 'rotate(12deg) scale(1.1)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {themeMode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
