export const REDIRECT_URI =
  process.env.VITE_REDIRECT_URI ||
  (typeof window !== 'undefined' ? window.location.origin + '/callback' : 'http://127.0.0.1:5173/callback');
