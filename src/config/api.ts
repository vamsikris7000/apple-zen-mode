// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in production (Netlify)
  if (window.location.hostname === 'appmywebsite.netlify.app') {
    // For now, use localhost even in production (you'll need to deploy backend separately)
    // This is a temporary solution until you deploy your backend
    return 'http://localhost:3001/api';
  }
  
  // Development - use localhost
  return 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();
