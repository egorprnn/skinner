import { CategoriesLevelProvider, useCategoriesLevelContext } from './CategoriesContext';

export const Categories = () => {
  const level = useCategoriesLevelContext();

  return (
    <CategoriesLevelProvider value={level}>
      <div
        style={{
          '--vkui_internal--categories-level': level,
        }}
      ></div>
    </CategoriesLevelProvider>
  );
};
