import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts';
import { useAppSelector } from '@/store';

const PrivateRoute = () => {
  const { isLoading } = useAuthContext();
  const { userInfo } = useAppSelector((store) => store.auth);

  if (isLoading) return <div>Loading...</div>;

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
