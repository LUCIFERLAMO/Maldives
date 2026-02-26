// Central API base URL — reads from environment variable.
// In development: set VITE_API_URL=http://localhost:5000 in frontend/.env
// In production:  set VITE_API_URL=https://your-render-app.onrender.com in Vercel env settings
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
