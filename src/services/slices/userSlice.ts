import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

// регистрации пользователя
export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

// логин
export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

// выход из системы
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

// проверка пользователя
export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const res = await getUserApi();
  return res.user;
});

// обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TRegisterData) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      // логин
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      // выход из системы
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // проверка пользователя
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true; // Проверка завершена, даже если юзер не найден
      })
      // обновление данных
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked
  }
});

export const { selectUser, selectIsAuthChecked } = userSlice.selectors;
export default userSlice.reducer;
