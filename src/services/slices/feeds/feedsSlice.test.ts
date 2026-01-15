import feedsReducer, { fetchFeeds, initialState } from './feedsSlice';

describe('Тестирование feedsSlice (Лента заказов)', () => {
  const mockFeedResponse = {
    orders: [
      {
        _id: '1',
        number: 123,
        status: 'done',
        name: 'Тестовый бургер',
        ingredients: ['1', '2'],
        createdAt: '2024',
        updatedAt: '2024'
      }
    ],
    total: 1000,
    totalToday: 50
  };

  it('fetchFeeds.fulfilled — сохранение данных ленты', () => {
    const state = feedsReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload: mockFeedResponse
    });

    expect(state.orders).toEqual(mockFeedResponse.orders);
    expect(state.total).toBe(mockFeedResponse.total);
    expect(state.totalToday).toBe(mockFeedResponse.totalToday);
  });
});
