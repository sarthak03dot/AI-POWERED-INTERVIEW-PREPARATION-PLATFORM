import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, alpha, useTheme } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';

const PublicLayout: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.palette.mode === 'dark'
                ? `radial-gradient(circle at 2% 10%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 40%),
                   radial-gradient(circle at 98% 90%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 40%),
                   ${theme.palette.background.default}`
                : `radial-gradient(circle at 2% 10%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 40%),
                   radial-gradient(circle at 98% 90%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 40%),
                   ${theme.palette.background.default}`,
            p: 2
        }}>
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: 'primary.main',
                        mb: 2,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                        animation: 'pulse 2s infinite'
                    }}>
                        <PsychologyIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                </Box>
                <Paper elevation={0} sx={{
                    p: { xs: 3, sm: 6 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(12px)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 50px rgba(0,0,0,0.3)'
                        : '0 20px 50px rgba(0,0,0,0.05)'
                }}>
                    <Outlet />
                </Paper>
            </Container>

            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
        </Box>
    );
};

export default PublicLayout;
