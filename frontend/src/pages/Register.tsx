import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
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
        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data.detail || 'Registration failed');
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                    Sign Up
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Login
                        </Button>
                    </form>
                </FormProvider>
            </Paper>
        </Box>
    );
};

export default Register;
