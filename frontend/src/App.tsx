import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { RootState } from './redux/store';
import { getTheme } from './theme/theme';
import { setLoading } from './redux/slices/uiSlice';

import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import GlobalLoader from './components/GlobalLoader';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const InterviewGenerate = lazy(() => import('./pages/InterviewGenerate'));
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'));
const History = lazy(() => import('./pages/History'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const MockInterview = lazy(() => import('./pages/MockInterview'));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { themeMode } = useSelector((state: RootState) => state.ui);
  const theme = getTheme(themeMode);

  // Handle Initial Load / Refresh
  useEffect(() => {
    dispatch(setLoading(true));
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1200); // Smooth 1.2s initializing sequence
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalLoader />
      <Suspense fallback={<GlobalLoader forced />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          </Route>

          {/* Protected SaaS Routes */}
          <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<InterviewGenerate />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="/history" element={<History />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/mock-interview" element={<MockInterview />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
