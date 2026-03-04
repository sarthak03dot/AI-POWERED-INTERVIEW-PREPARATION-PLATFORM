import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    themeMode: 'light' | 'dark';
    sidebarOpen: boolean;
    notifications: {
        id: string;
        title: string;
        message: string;
        type?: 'success' | 'error' | 'info';
        read: boolean;
        timestamp: string;
    }[];
    isLoading: boolean;
}

const initialState: UIState = {
    themeMode: (localStorage.getItem('themeMode') as 'light' | 'dark') || 'dark',
    sidebarOpen: true,
    isLoading: false,
    notifications: [
        {
            id: '1',
            title: 'Welcome Back!',
            message: 'Ready to crush some interviews today?',
            read: false,
            timestamp: new Date().toISOString()
        }
    ]
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', state.themeMode);
        },
        setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.themeMode = action.payload;
            localStorage.setItem('themeMode', state.themeMode);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notif = state.notifications.find(n => n.id === action.payload);
            if (notif) notif.read = true;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => {
                n.read = true;
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        addNotification: (state, action: PayloadAction<{ title: string; message: string; type?: 'success' | 'error' | 'info' }>) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newNotif = {
                id,
                title: action.payload.title,
                message: action.payload.message,
                type: action.payload.type || 'info', // Added type for styling toasts
                read: false,
                timestamp: new Date().toISOString()
            };
            // Add to the beginning of the array
            state.notifications = [newNotif, ...state.notifications].slice(0, 10);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    toggleTheme,
    setThemeMode,
    toggleSidebar,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    clearNotifications,
    setLoading
} = uiSlice.actions;
export default uiSlice.reducer;
