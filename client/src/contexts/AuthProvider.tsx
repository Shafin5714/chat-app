import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { authSlice } from '@/slices';
import messengerApi from '@/apis/messenger';
import { useSocketContext } from '@/contexts';
type Props = {
  children: ReactNode;
};

type UserInfo = {
  _id: string;
  token: string;
  username: string;
  email: string;
  image: string;
};

const AuthContext = createContext<{
  isLoading: boolean;
  login: (data: UserInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
}>({
  isLoading: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: Props) {
  // hooks
  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // store
  const { userInfo } = useAppSelector((store) => store.auth);

  useEffect(() => {
    setIsLoading(true);
    if (userInfo) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [userInfo]);

  const login = (data: UserInfo) => {
    const { _id, token, username, email, image } = data;
    dispatch(
      authSlice.actions.setData({
        _id,
        token,
        username,
        email,
        image,
      }),
    );
  };

  const logout = () => {
    socket?.disconnect();
    dispatch(authSlice.actions.logout());
    dispatch(messengerApi.util.resetApiState());
  };

  return (
    <AuthContext.Provider value={{ isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);
