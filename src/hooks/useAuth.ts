import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  organization?: {
    _id: string;
    name: string;
  };
}

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  return { user };
}; 