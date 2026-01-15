import userReducer, {
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth, // Важно: было getUser
  updateUser,
  initialState
} from './userSlice';

describe('Тестирование userSlice (асинхронные экшены)', () => {
  const mockUser = {
    email: 'test@burger.com',
    name: 'Ivan Ivanov'
  };

  describe('registerUser', () => {
    // В твоем коде нет pending для registerUser, поэтому проверяем только fulfilled
    it('состояние fulfilled', () => {
      const state = userReducer(initialState, {
        type: registerUser.fulfilled.type,
        payload: mockUser // В твоем Thunk возвращается res.user напрямую
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('состояние pending', () => {
      const state = userReducer(initialState, { type: loginUser.pending.type });
      expect(state.loginRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('состояние fulfilled', () => {
      const state = userReducer(initialState, {
        type: loginUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.loginRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('состояние rejected', () => {
      const state = userReducer(initialState, {
        type: loginUser.rejected.type,
        error: { message: 'Ошибка входа' }
      });
      expect(state.loginRequest).toBe(false);
      expect(state.error).toBe('Ошибка входа');
    });
  });

  describe('checkUserAuth (getUser)', () => {
    it('состояние pending', () => {
      const state = userReducer(initialState, {
        type: checkUserAuth.pending.type
      });
      expect(state.isAuthChecked).toBe(false);
    });

    it('состояние fulfilled', () => {
      const state = userReducer(initialState, {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('состояние rejected', () => {
      const state = userReducer(initialState, {
        type: checkUserAuth.rejected.type
      });
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('состояние fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'New Name' };
      const state = userReducer(initialState, {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      });
      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('logoutUser', () => {
    it('состояние fulfilled', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const state = userReducer(loggedInState, {
        type: logoutUser.fulfilled.type
      });
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
