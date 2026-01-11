import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user/userSlice';

export const AppHeader: FC = () => {
  // чтобы отобразить имя зарег. юзера
  const user = useSelector(selectUser);

  // передаем имя в ЮИ
  return <AppHeaderUI userName={user?.name || ''} />;
};
