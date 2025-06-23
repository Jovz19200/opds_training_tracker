import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchUser } from '@/redux/reducers/authSlice';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization: string;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
}; 