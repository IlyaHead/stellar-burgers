import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

// тип для ответов сервера
interface TOrderResponse {
  success: boolean;
  orders?: TOrder[];
  name?: string;
  order?: TOrder;
}

interface TOrderState {
  userOrders: TOrder[];
  orderData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
}

const initialState: TOrderState = {
  userOrders: [],
  orderData: null,
  orderRequest: false,
  error: null
};

export const postOrder = createAsyncThunk<TOrderResponse, string[]>(
  'order/postOrder',
  async (ingredients) => await orderBurgerApi(ingredients)
);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'order/fetchUserOrders',
  async () => await getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk<TOrderResponse, number>(
  'order/fetchOrderByNumber',
  async (number) => await getOrderByNumberApi(number)
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
        state.orderData = action.payload.order || null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка загрузки истории';
      })

      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (action.payload.orders && action.payload.orders.length > 0) {
          state.orderData = action.payload.orders[0];
        }
      });
  },
  selectors: {
    selectUserOrders: (state) => state.userOrders,
    selectOrderData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest
  }
});

export const { clearOrder } = orderSlice.actions;

export const { selectUserOrders, selectOrderData, selectOrderRequest } =
  orderSlice.selectors;

export default orderSlice.reducer;
