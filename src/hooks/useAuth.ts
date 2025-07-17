import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await SecureStore.getItemAsync('userToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}
