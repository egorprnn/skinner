import { createContext, useContext } from 'react';

const CategoriesLevelContext = createContext(0);
export const CategoriesLevelProvider = CategoriesLevelContext.Provider;

export const useCategoriesLevelContext = () => useContext(CategoriesLevelContext) + 1;
