import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './store';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Message from '@/pages/message';
import PrivateRoute from '@/components/PrivateRoute';
import PublicRoute from '@/components/PublicRoute.tsx';
import { AuthProvider, SocketProvider } from '@/contexts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Message />} />
      </Route>
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
