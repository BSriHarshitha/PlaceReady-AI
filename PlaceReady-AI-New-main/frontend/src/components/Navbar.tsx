import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide
} from '@mui/material';
import {
  AccountCircle
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeToggle } from './DarkModeToggle';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleClose();
  };

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                fontSize: '1.5rem'
              }}
            >
              PlaceReady AI
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button component={Link} to="/" sx={{ color: '#64748b', fontWeight: 500 }}>
              Home
            </Button>
            <Button component={Link} to="/features" sx={{ color: '#64748b', fontWeight: 500 }}>
              Features
            </Button>
            <Button component={Link} to="/ai-features" sx={{ color: '#64748b', fontWeight: 500 }}>
              AI Features
            </Button>
            <Button component={Link} to="/learn" sx={{ color: '#64748b', fontWeight: 500 }}>
              Learn
            </Button>
            <Button component={Link} to="/skill-analysis" sx={{ color: '#64748b', fontWeight: 500 }}>
              Skill Analysis
            </Button>
            {currentUser && (
              <Button component={Link} to="/dashboard" sx={{ color: '#64748b', fontWeight: 500 }}>
                Dashboard
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DarkModeToggle />
            {currentUser ? (
              <>
                <IconButton onClick={handleMenu} sx={{ color: '#4f46e5' }}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    color: '#4f46e5',
                    fontWeight: 600
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/skill-analysis"
                  variant="contained"
                  sx={{ 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Analyze Your Readiness
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default Navbar;