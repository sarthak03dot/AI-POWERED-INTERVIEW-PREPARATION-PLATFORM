import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InterviewGenerate from './pages/InterviewGenerate';
import DailyChallenge from './pages/DailyChallenge';
import History from './pages/History';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0} color="inherit" sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <Typography variant="h6" component="div" onClick={() => navigate('/')} sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main', cursor: 'pointer' }}>
              InterviewPrep Platform
            </Typography>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
                <Button color="inherit" onClick={() => navigate('/practice')}>Practice</Button>
                <Button color="inherit" onClick={() => navigate('/daily')}>Daily Challenge</Button>
                <Button color="inherit" onClick={() => navigate('/history')} sx={{ mr: 2 }}>History</Button>
                <Typography variant="body1" sx={{ mr: 2, ml: 2, display: { xs: 'none', md: 'block' } }}>Welcome, {user?.name}</Typography>
                <Button color="primary" variant="outlined" onClick={() => dispatch(logout())}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="primary" variant="text" onClick={() => navigate('/login')}>Login</Button>
                <Button color="primary" variant="contained" onClick={() => navigate('/register')} sx={{ ml: 2 }}>Sign Up</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/practice" element={isAuthenticated ? <InterviewGenerate /> : <Navigate to="/login" />} />
          <Route path="/daily" element={isAuthenticated ? <DailyChallenge /> : <Navigate to="/login" />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
        </Routes>
      </Box>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
