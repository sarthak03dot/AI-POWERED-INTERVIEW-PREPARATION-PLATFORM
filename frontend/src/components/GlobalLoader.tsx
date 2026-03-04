import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha, Fade } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const GlobalLoader: React.FC<{ forced?: boolean }> = ({ forced }) => {
    const theme = useTheme();
    const { isLoading } = useSelector((state: RootState) => state.ui);

    const show = isLoading || forced;

    if (!show) return null;

    return (
        <Fade in={show}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.background.default, 0.8),
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease',
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress
                        size={80}
                        thickness={2}
                        sx={{
                            color: theme.palette.primary.main,
                            filter: `drop-shadow(0 0 15px ${alpha(theme.palette.primary.main, 0.5)})`,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            animation: 'pulse 2s infinite ease-in-out',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)', opacity: 1 },
                                '100%': { transform: 'scale(1.5)', opacity: 0 },
                            },
                        }}
                    />
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        mt: 4,
                        fontWeight: 800,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'fadeInOut 2s infinite ease-in-out',
                        '@keyframes fadeInOut': {
                            '0%, 100%': { opacity: 0.5 },
                            '50%': { opacity: 1 },
                        },
                    }}
                >
                    Initializing Mission
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
                    {localStorage.getItem('user') ? 'RESUMING SESSION...' : 'READYING PLATFORM...'}
                </Typography>
            </Box>
        </Fade>
    );
};

export default GlobalLoader;
