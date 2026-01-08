import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      if (tab === 0) {
        // Login
        await login(email, password);
        navigate('/dashboard');
      } else {
        // Signup
        if (!name) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        await signup(email, password, { name, college, branch, year, role });
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Welcome to PlaceReady AI
          </Typography>
          
          <Tabs 
            value={tab} 
            onChange={(_, newValue) => setTab(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Graduation Year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="admin">Placement Officer</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                py: 1.5,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                tab === 0 ? 'Login' : 'Sign Up'
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;