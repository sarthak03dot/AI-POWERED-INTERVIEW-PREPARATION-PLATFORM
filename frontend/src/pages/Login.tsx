import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import type { AppDispatch, RootState } from '../redux/store';
import FormInput from '../components/FormInput';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';

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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                    Sign In
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>
                </FormProvider>
            </Paper>
        </Box>
    );
};

export default Login;
