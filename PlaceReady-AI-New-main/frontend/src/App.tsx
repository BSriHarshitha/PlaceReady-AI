import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Features from './pages/Features';
import Learn from './pages/Learn';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SkillAnalysis from './pages/SkillAnalysis';
import DemoShowcase from './pages/DemoShowcase';
import PresentationSlides from './pages/PresentationSlides';
import AIFeatures from './pages/AIFeatures';
import { initGA } from './utils/analytics';
import { ToastContainer } from './components/ToastContainer';
import './App.css';

// PrepInsta-inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
    },
    secondary: {
      main: '#06b6d4',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 24px',
        },
      },
    },
  },
});

function App() {
  // Initialize Google Analytics
  React.useEffect(() => {
    initGA();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/features" element={<Features />} />
              <Route path="/ai-features" element={<AIFeatures />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/demo" element={<DemoShowcase />} />
              <Route path="/presentation" element={<PresentationSlides />} />
              <Route 
                path="/skill-analysis" 
                element={
                  <ProtectedRoute>
                    <SkillAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;