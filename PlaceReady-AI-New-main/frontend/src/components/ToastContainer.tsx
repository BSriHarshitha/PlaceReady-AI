import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, AlertColor } from '@mui/material';
import { Toast, toastManager } from '../utils/ToastNotification';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
      }
    });
    
    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
          sx={{ marginBottom: index * 80 + 'px' }}
        >
          <Alert 
            onClose={() => handleClose(toast.id)}
            severity={toast.type as AlertColor}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};
