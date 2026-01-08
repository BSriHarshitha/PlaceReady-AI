import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Cookies from 'js-cookie';

export const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = Cookies.get('darkMode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
      Cookies.set('darkMode', 'true', { expires: 365 });
    } else {
      root.classList.remove('dark-mode');
      Cookies.set('darkMode', 'false', { expires: 365 });
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton onClick={toggleDarkMode} color="inherit" aria-label="toggle dark mode">
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

