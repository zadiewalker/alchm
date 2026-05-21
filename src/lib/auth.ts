export {
  onAuthChanged,
  signInWithEmail as signIn,
  signOut as logout,
  signUpWithEmail as signUp,
} from '@/services/auth/authService';

export { useAuth } from '@/hooks/useAuth';
