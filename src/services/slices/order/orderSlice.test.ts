import orderReducer, {
  postOrder,
  fetchUserOrders,
  fetchOrderByNumber,
  clearOrder,
  orderSlice
} from './orderSlice';

describe('Тестирование orderSlice', () => {
  const initialState = {
    userOrders: [],
    orderData: null,
    orderRequest: false,
    error: null
  };

  const mockOrder = {
    _id: '1',
    number: 12345,
    status: 'done',
    name: 'Space Burger',
    ingredients: ['1', '2'],
    createdAt: '',
    updatedAt: ''
  };

  it('должен очищать данные заказа при вызове clearOrder', () => {
    const stateWithData = { ...initialState, orderData: mockOrder };
    const state = orderReducer(stateWithData, clearOrder());
    expect(state.orderData).toBeNull();
  });

  describe('postOrder асинхронный экшен', () => {
    it('состояние pending', () => {
      const state = orderReducer(initialState, {
        type: postOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('состояние fulfilled', () => {
      const mockResponse = {
        success: true,
        order: mockOrder,
        name: 'Space Burger'
      };
      const state = orderReducer(initialState, {
        type: postOrder.fulfilled.type,
        payload: mockResponse
      });
      expect(state.orderRequest).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
    });

    it('состояние rejected', () => {
      const state = orderReducer(initialState, {
        type: postOrder.rejected.type,
        error: { message: 'Ошибка оформления заказа' }
      });
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка оформления заказа');
    });
  });

  describe('fetchUserOrders асинхронный экшен', () => {
    it('состояние pending', () => {
      const state = orderReducer(initialState, {
        type: fetchUserOrders.pending.type
      });
      expect(state.orderRequest).toBe(true);
    });

    it('состояние fulfilled', () => {
      const mockOrdersList = [mockOrder];
      const state = orderReducer(initialState, {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrdersList
      });
      expect(state.orderRequest).toBe(false);
      expect(state.userOrders).toEqual(mockOrdersList);
    });

    it('состояние rejected', () => {
      const state = orderReducer(initialState, {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка загрузки истории' }
      });
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка загрузки истории');
    });
  });

  describe('fetchOrderByNumber асинхронный экшен', () => {
    it('состояние fulfilled', () => {
      const mockResponse = { success: true, orders: [mockOrder] };
      const state = orderReducer(initialState, {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockResponse
      });
      expect(state.orderData).toEqual(mockOrder);
    });

    it('состояние fulfilled с пустым массивом не должно менять стейт', () => {
      const mockResponse = { success: true, orders: [] };
      const state = orderReducer(initialState, {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockResponse
      });
      expect(state.orderData).toBeNull();
    });
  });
});
