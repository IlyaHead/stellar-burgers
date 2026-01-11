import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectOrders
} from '../../services/slices/feeds/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // получаем через селектор заказы из слайса
  const orders = useSelector(selectOrders);

  // загрузка данных при первом рендере
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  // useCallback для обновления, чтобы не пересоздавать её при каждом рендере
  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
