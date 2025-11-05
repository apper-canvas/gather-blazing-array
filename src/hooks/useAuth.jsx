// Redirect to the actual useAuth implementation from Root.jsx
// This resolves the "useAuth must be used within an AuthProvider" error
// by ensuring components use the authentication context that's actually provided
export { useAuth } from '@/layouts/Root';

// Note: The AuthProvider is handled by Root.jsx in the application architecture
// This ensures consistency with the Redux-based authentication system