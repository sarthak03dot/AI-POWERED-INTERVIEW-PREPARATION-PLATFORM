import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials.email, credentials.password);
            // Backend returns: {"access_token": token, "refresh_token": token, "token_type": "bearer"}
            localStorage.setItem('token', response.access_token);
            if (response.refresh_token) {
                localStorage.setItem('refreshToken', response.refresh_token);
            }
            return {
                token: response.access_token,
                refreshToken: response.refresh_token,
                email: credentials.email
            };
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.detail || 'Login failed');
            }
            return rejectWithValue(error.message);
        }
    }
);

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || null;
                state.user = { id: 'auth-user', name: 'User', email: action.payload.email };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
