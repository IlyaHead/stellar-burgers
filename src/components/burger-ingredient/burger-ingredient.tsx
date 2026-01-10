import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    let ingredientCount =
      count !== undefined ? count : (ingredient as any).count;

    // Логика для булок, булка может быть только одна в заказе
    if (ingredient.type === 'bun' && ingredientCount > 0) {
      ingredientCount = 1;
    }

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={ingredientCount > 0 ? ingredientCount : undefined}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
