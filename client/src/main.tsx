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
import Messenger from '@/pages/messenger';
import PrivateRoute from '@/components/PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<Messenger />} />
      </Route>
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
