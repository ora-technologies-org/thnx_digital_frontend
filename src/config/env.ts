export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4001/api',
  environment: import.meta.env.MODE || 'development',
} as const;         