import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

const PrivateRoute = () => {
  const { userInfo } = useAppSelector((store) => store.auth);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
