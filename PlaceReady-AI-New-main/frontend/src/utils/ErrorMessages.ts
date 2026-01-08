// Better error messages with specific guidance
export interface ErrorDetail {
  message: string;
  suggestion: string;
  action?: string;
  link?: string;
}

export const getErrorMessage = (error: any): ErrorDetail => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
  const errorCode = error?.code || error?.status;

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      message: 'Network Connection Error',
      suggestion: 'Please check your internet connection and try again.',
      action: 'Retry Connection',
    };
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorCode === 'ECONNABORTED') {
    return {
      message: 'Request Timeout',
      suggestion: 'The request took too long to complete. Please try again.',
      action: 'Retry',
    };
  }

  // File errors
  if (errorMessage.includes('file') || errorMessage.includes('PDF')) {
    if (errorMessage.includes('size')) {
      return {
        message: 'File Too Large',
        suggestion: 'Please upload a PDF file smaller than 5MB.',
        action: 'Choose Different File',
      };
    }
    if (errorMessage.includes('type') || errorMessage.includes('format')) {
      return {
        message: 'Invalid File Format',
        suggestion: 'Please upload a valid PDF file.',
        action: 'Choose PDF File',
      };
    }
    return {
      message: 'File Processing Error',
      suggestion: 'We couldn\'t process your resume. Please ensure it\'s a valid PDF and try again.',
      action: 'Retry Upload',
    };
  }

  // API errors
  if (errorCode >= 500) {
    return {
      message: 'Server Error',
      suggestion: 'Our servers are experiencing issues. Please try again in a few moments.',
      action: 'Retry',
    };
  }

  if (errorCode === 401 || errorCode === 403) {
    return {
      message: 'Authentication Error',
      suggestion: 'Your session may have expired. Please log in again.',
      action: 'Login',
      link: '/login',
    };
  }

  if (errorCode === 404) {
    return {
      message: 'Resource Not Found',
      suggestion: 'The requested resource could not be found.',
      action: 'Go Home',
      link: '/',
    };
  }

  // OpenAI/API key errors
  if (errorMessage.includes('API key') || errorMessage.includes('OpenAI')) {
    return {
      message: 'API Configuration Error',
      suggestion: 'There\'s an issue with the AI service configuration. Please contact support.',
      action: 'Contact Support',
    };
  }

  // Resume parsing errors
  if (errorMessage.includes('parse') || errorMessage.includes('extract')) {
    return {
      message: 'Resume Parsing Failed',
      suggestion: 'We couldn\'t extract information from your resume. Please ensure your PDF is readable and contains clear text.',
      action: 'Check Resume',
    };
  }

  // Default error
  return {
    message: 'An Error Occurred',
    suggestion: errorMessage || 'Something went wrong. Please try again or contact support if the issue persists.',
    action: 'Retry',
  };
};

