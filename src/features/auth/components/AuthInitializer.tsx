

// src/features/auth/components/AuthInitializer.tsx
import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setUser, logout, setLoading } from '../slices/authSlice';
import { authService } from '../services/authService';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 AuthInitializer: Starting authentication check...');
      
      const accessToken = localStorage.getItem('accessToken');
      console.log('🔑 Access token exists:', !!accessToken);

      if (!accessToken) {
        console.log('❌ No access token found, user not authenticated');
        dispatch(logout());
        return;
      }

      try {
        console.log('📡 Fetching current user from backend...');
        dispatch(setLoading(true));
        
        const user = await authService.getCurrentUser();
        
        console.log('✅ User fetched successfully:', user);
        dispatch(setUser(user));
        
      } catch (error: any) {
        console.error('❌ Auth initialization failed:', error);
        console.log('Token might be expired or invalid, logging out...');
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};