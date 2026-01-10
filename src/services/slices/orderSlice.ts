import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';

// для оформления нового заказа
export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res.order;
  }
);

// для получения истории заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => await getOrdersApi()
);

interface OrderState {
  orderData: TOrder | null;
  userOrders: TOrder[];
  orderRequest: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderData: null,
  userOrders: [],
  orderRequest: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = Array.isArray(action.payload)
          ? action.payload
          : (action.payload as any).orders || [];
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
      });
  },
  selectors: {
    selectOrderData: (state) => state.orderData,
    selectUserOrders: (state) => state.userOrders,
    selectOrderRequest: (state) => state.orderRequest
  }
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrderData, selectUserOrders, selectOrderRequest } =
  orderSlice.selectors;

export default orderSlice.reducer;
