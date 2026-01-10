import { FC, useState, useRef, useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectConstructorData } from '../../services/slices/constructorSlice';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const constructorItems = useSelector(selectConstructorData);

  const getCount = (item: TIngredient): number => {
    if (item.type === 'bun') {
      return constructorItems.bun?._id === item._id ? 2 : 0;
    }
    return constructorItems.ingredients.filter((ing) => ing._id === item._id)
      .length;
  };
  const buns = useMemo(
    () =>
      ingredients
        .filter((i) => i.type === 'bun')
        .map((i) => ({ ...i, count: getCount(i) })),
    [ingredients, constructorItems.bun]
  );

  const sauces = useMemo(
    () =>
      ingredients
        .filter((i) => i.type === 'sauce')
        .map((i) => ({ ...i, count: getCount(i) })),
    [ingredients, constructorItems.ingredients]
  );

  const mains = useMemo(
    () =>
      ingredients
        .filter((i) => i.type === 'main')
        .map((i) => ({ ...i, count: getCount(i) })),
    [ingredients, constructorItems.ingredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSauceRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFeeding] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFeeding) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFeeding, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSauceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSauceRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
