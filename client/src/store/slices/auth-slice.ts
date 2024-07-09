import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  accessToken: string;
  name: string;
  email: string;
  phone: string;
};

const initialState: AuthState = {
  accessToken: '',
  name: '',
  email: '',
  phone: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: () => initialState,

    setData: (state, action: PayloadAction<AuthState>) => {
      state = action.payload;
    },
  },
});
