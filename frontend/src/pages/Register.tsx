import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { authService } from '../services/authService';

type RegisterFormInputs = {
    username: string;
    email: string;
    password: string;
};

const Register: React.FC = () => {
    const methods = useForm<RegisterFormInputs>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: RegisterFormInputs) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.register(data.username, data.email, data.password);
            // On success, redirect to login
            navigate('/login');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } }, message: string };
            if (error.response && error.response.data) {
                setError(error.response.data.detail || 'Registration failed');
            } else {
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" fontWeight={900} gutterBottom textAlign="center" sx={{ mb: 1, color: 'text.primary' }}>
                Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                Join our premium AI interview preparation platform
            </Typography>

            {error && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <FormInput
                        name="username"
                        label="Username"
                        type="text"
                        rules={{ required: 'Username is required' }}
                    />
                    <FormInput
                        name="email"
                        label="Email Address"
                        type="email"
                        rules={{ required: 'Email is required' }}
                    />
                    <FormInput
                        name="password"
                        label="Password"
                        type="password"
                        rules={{ required: 'Password is required' }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 3, py: 1.5, borderRadius: 2, fontWeight: 800 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Log In
                            </Typography>
                        </Typography>
                    </Box>
                </form>
            </FormProvider>
        </Box>
    );
};

export default Register;
