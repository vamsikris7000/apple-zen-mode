// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in production (Netlify)
  if (window.location.hostname === 'appmywebsite.netlify.app') {
    // Use Netlify function as proxy
    return '/.netlify/functions/api';
  }
  
  // Development - use localhost
  return 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();
