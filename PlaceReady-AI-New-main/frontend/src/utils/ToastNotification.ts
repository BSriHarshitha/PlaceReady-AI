// Toast Notification Manager
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private listeners: ((toast: Toast) => void)[] = [];

  subscribe(callback: (toast: Toast) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  show(message: string, type: ToastType = 'info', duration = 3000) {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    
    this.listeners.forEach(listener => listener(toast));
    
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    
    return id;
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  dismiss(id: string) {
    // Handle dismissal in component
  }
}

export const toastManager = new ToastManager();
