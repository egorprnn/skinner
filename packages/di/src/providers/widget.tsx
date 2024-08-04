import { ComponentType, FC, PropsWithChildren } from 'react';

export const createWidget = <Props extends PropsWithChildren<{ [key: string]: any }>>(
  Provider: FC<Props>,
  Component: ComponentType<PropsWithChildren<any>>,
) =>
  function Widget(props: Props) {
    return (
      <Provider {...props}>
        <Component>{props.children}</Component>
      </Provider>
    );
  };
