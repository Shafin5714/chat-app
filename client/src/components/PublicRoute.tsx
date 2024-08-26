import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useAppSelector } from '@/store';

const PublicRoute = () => {
  const { isLoading } = useAuthContext();
  const { userInfo } = useAppSelector((store) => store.auth);

  if (isLoading) return <div>Loading...</div>;

  return userInfo ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
