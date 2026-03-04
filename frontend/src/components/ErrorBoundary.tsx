import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ReportProblem as ErrorIcon, Refresh as RefreshIcon } from "@mui/icons-material";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        height: '80vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3
                    }}
                >
                    <Paper
                        className="glass-card"
                        sx={{
                            p: 5,
                            maxWidth: 500,
                            textAlign: 'center',
                            bgcolor: 'rgba(239, 68, 68, 0.05)',
                            borderColor: 'rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Something went wrong.</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                            We encountered an unexpected error while rendering this component. Our team has been notified.
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<RefreshIcon />}
                            onClick={() => window.location.reload()}
                            sx={{ borderRadius: 2 }}
                        >
                            Reload Application
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
