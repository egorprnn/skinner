import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { DIContainer, rootContainer } from '../container';

const ContainerContext = createContext<DIContainer>(rootContainer);
export const useContainer = () => useContext(ContainerContext);

export type DIProviderProps = PropsWithChildren<{
  /**
   * Флаг для изоляции всех глобальных сервисов контейнера.
   * При его использовании, инстансы глобальных сервисов
   * будут созданы именно в этом контейнере и будут доступны
   * всей нижележащей иерархии
   * */
  isolated?: boolean;
  /**
   * Имя контейнера, которое необходимо для сериализации всей
   * иерархии контейнеров на сервере
   * */
  name: string;
}>;

/**
 * Провайдер для предоставления доступа к DI контейнеру
 * */
export const DIProvider = ({
  instance = rootContainer,
  children,
}: PropsWithChildren<{ instance: DIContainer }>) => {
  return <ContainerContext.Provider value={instance}>{children}</ContainerContext.Provider>;
};

/**
 * Провайдер предоставляет простой способ создать дочерний DI контейнер
 * и предоставить его всей нижележащей иерархии виджетов
 * */
export const ChildDIProvider = ({ children, name, isolated }: DIProviderProps) => {
  const di = useContainer() || rootContainer;

  const [childDi] = useState(() => di.child(name, isolated));

  useEffect(
    () => () => {
      childDi.destroy();
    },
    [],
  );

  return <DIProvider instance={childDi}>{children}</DIProvider>;
};
