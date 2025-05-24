import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CssBaseline,
  Box,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HotelList from './components/hotels/HotelList';
import './App.css';

const backgroundImageURL =
  'https://media.istockphoto.com/id/503016934/photo/entrance-of-luxury-hotel.jpg?s=612x612&w=0&k=20&c=DXFzucB2xWGf3PI6_yjhLKDvrFcGlOpOjXh6KDI8rqU=';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a1930',
      contrastText: '#f7f7f7',
    },
    secondary: {
      main: '#c5a880',
      contrastText: '#0a1930',
    },
    background: {
      default: '#0a1930',
      paper: 'transparent',
    },
    text: {
      primary: '#f7f7f7',
      secondary: '#c5a880',
    },
  },
  typography: {
    fontFamily: `'Lato', sans-serif`,
    h1: {
      fontFamily: `'Cinzel', serif`,
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '0.05em',
    },
    h6: {
      fontFamily: `'Cinzel', serif`,
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    body1: {
      fontFamily: `'Figtree', sans-serif`,
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
  },
});

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(10, 25, 47, 0.85)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ width: '33%' }} />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            flexGrow: 1,
            width: '33%',
            color: 'secondary.main',
          }}
        >
          Hotel Reservation System
        </Typography>

        <Box sx={{ width: '33%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button component={Link} to="/" sx={{ color: 'secondary.main', textTransform: 'none' }}>Home</Button>
          <Button component={Link} to="/hotels" sx={{ color: 'secondary.main', textTransform: 'none' }}>Hotels</Button>
          {user ? (
            <>
              <Button component={Link} to="/dashboard" sx={{ color: 'secondary.main', textTransform: 'none' }}>Dashboard</Button>
              <Button onClick={logout} sx={{ color: 'secondary.main', textTransform: 'none' }}>Logout</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: 'secondary.main', textTransform: 'none' }}>Login</Button>
              <Button component={Link} to="/register" sx={{ color: 'secondary.main', textTransform: 'none' }}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const PageWrapper = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.7)), url('${backgroundImageURL}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: 10,
    }}
  >
    <Paper
      elevation={8}
      sx={{
        padding: 4,
        maxWidth: 500,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      {children}
    </Paper>
  </Box>
);

const Home = () => (
  <PageWrapper>
    <Typography variant="h1" gutterBottom sx={{ color: '#c5a880' }}>
      Welcome to Hotel Reservation System
    </Typography>
    <Typography variant="body1" paragraph>
      Find and book the perfect room for your stay. Browse our selection of rooms,
      check availability, and make reservations with ease.
    </Typography>
    <Button
      variant="outlined"
      sx={{
        borderColor: '#c5a880',
        color: '#c5a880',
        fontWeight: 'bold',
        mt: 2,
        '&:hover': {
          backgroundColor: '#c5a880',
          color: '#0a1930',
          borderColor: '#c5a880',
        },
      }}
      component={Link}
      to="/hotels"
      size="large"
    >
      Search Rooms
    </Button>
  </PageWrapper>
);

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, bgcolor: 'background.paper', p: 4, borderRadius: 3, boxShadow: 4 }}
    >
      <Typography variant="h4" gutterBottom color="secondary">
        Welcome, {user?.firstName}!
      </Typography>
      <Typography variant="body1" paragraph color="text.primary">
        This is your personal dashboard where you can manage your bookings and profile.
      </Typography>
    </Container>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<PageWrapper><HotelList /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
