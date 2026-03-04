import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import type { AppDispatch, RootState } from '../redux/store';
import FormInput from '../components/FormInput';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';

type LoginFormInputs = {
    email: string;
    password?: string; // Adding for the real backend
};

const Login: React.FC = () => {
    const methods = useForm<LoginFormInputs>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const onSubmit = async (data: LoginFormInputs) => {
        if (data.email && data.password) {
            const resultAction = await dispatch(loginUser({ email: data.email, password: data.password }));
            if (loginUser.fulfilled.match(resultAction)) {
                navigate('/');
            }
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" fontWeight={900} gutterBottom textAlign="center" sx={{ mb: 1, color: 'text.primary' }}>
                Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                Enter your credentials to access your account
            </Typography>

            {error && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </Typography>
                        </Typography>
                    </Box>
                </form>
            </FormProvider>
        </Box>
    );
};

export default Login;
