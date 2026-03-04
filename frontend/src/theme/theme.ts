import { createTheme, alpha } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? 'hsl(245, 82%, 67%)' : 'hsl(245, 82%, 57%)',
            light: 'hsl(245, 82%, 75%)',
            dark: 'hsl(245, 82%, 45%)',
        },
        secondary: {
            main: mode === 'dark' ? 'hsl(271, 91%, 70%)' : 'hsl(271, 91%, 60%)',
            light: 'hsl(271, 91%, 80%)',
            dark: 'hsl(271, 91%, 50%)',
        },
        background: {
            default: mode === 'dark' ? 'hsl(222, 47%, 7%)' : 'hsl(210, 40%, 98%)',
            paper: mode === 'dark' ? 'hsl(222, 47%, 11%)' : 'hsl(0, 0%, 100%)',
        },
        text: {
            primary: mode === 'dark' ? 'hsl(210, 40%, 98%)' : 'hsl(222, 47%, 11%)',
            secondary: mode === 'dark' ? 'hsl(215, 20%, 65%)' : 'hsl(215, 25%, 35%)',
        },
        divider: mode === 'dark' ? 'hsla(210, 40%, 98%, 0.08)' : 'hsla(222, 47%, 11%, 0.08)',
    },
    typography: {
        fontFamily: '"Inter", "Outfit", sans-serif',
        h1: { fontFamily: 'Outfit', fontWeight: 800 },
        h2: { fontFamily: 'Outfit', fontWeight: 800 },
        h3: { fontFamily: 'Outfit', fontWeight: 700 },
        h4: { fontFamily: 'Outfit', fontWeight: 700 },
        h5: { fontFamily: 'Outfit', fontWeight: 600 },
        h6: { fontFamily: 'Outfit', fontWeight: 600 },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 8, // Standardized to 8px base (borderRadius: 2 = 16px)
    },
});

export const getTheme = (mode: 'light' | 'dark') => {
    const tokens = getDesignTokens(mode);
    return createTheme({
        ...tokens,
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarColor: mode === 'dark'
                            ? "rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.02)"
                            : "rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.02)",
                        "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                            width: 8,
                        },
                        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                            borderRadius: 8,
                            backgroundColor: mode === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                            minHeight: 24,
                        },
                        "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                            backgroundColor: mode === 'dark' ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '10px 24px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    containedPrimary: {
                        boxShadow: `0 4px 12px ${alpha('#6366f1', 0.2)}`,
                        '&:hover': {
                            boxShadow: `0 6px 16px ${alpha('#6366f1', 0.3)}`,
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        border: mode === 'dark' ? '1px solid hsla(210, 40%, 98%, 0.05)' : '1px solid hsla(222, 47%, 11%, 0.05)',
                        boxShadow: mode === 'dark' ? 'none' : '0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        backgroundColor: mode === 'dark' ? 'hsla(222, 47%, 15%, 0.7)' : 'hsla(0, 0%, 100%, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: mode === 'dark' ? '1px solid hsla(210, 40%, 98%, 0.1)' : '1px solid hsla(222, 47%, 11%, 0.06)',
                        boxShadow: mode === 'dark' ? '0 20px 25px -5px rgb(0 0 0 / 0.2)' : '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'dark' ? 'hsla(222, 47%, 7%, 0.8)' : 'hsla(0, 0%, 100%, 0.8)',
                        backdropFilter: 'blur(16px)',
                        borderBottom: mode === 'dark' ? '1px solid hsla(210, 40%, 98%, 0.08)' : '1px solid hsla(222, 47%, 11%, 0.05)',
                        boxShadow: 'none',
                        backgroundImage: 'none',
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: mode === 'dark' ? alpha('#0f172a', 0.9) : '#ffffff',
                        backdropFilter: 'blur(20px)',
                        borderRight: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
                        backgroundImage: 'none',
                    },
                },
            },
            MuiFilledInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 12,
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                        },
                        '&:before, &:after': {
                            display: 'none',
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontWeight: 600,
                        fontSize: '0.9rem',
                    },
                },
            },
        },
    });
};
