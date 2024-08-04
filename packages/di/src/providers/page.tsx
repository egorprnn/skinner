import { PropsWithChildren } from 'react';
import { InferProps, ModelConstructorType } from './types';
import { ChildDIProvider } from './container';
import { createProvider } from './model';

export const createPageProvider = <ModelClassType extends ModelConstructorType<any>>(
  ModelClass: ModelClassType,
) => {
  const { useModel, Provider } = createProvider(ModelClass);

  type PropsType = InferProps<ModelClassType>;

  return {
    useModel,
    Provider: (props: PropsWithChildren<PropsType & { name?: string }>) => (
      <ChildDIProvider name={props.name ?? ModelClass.name}>
        <Provider {...props} />
      </ChildDIProvider>
    ),
  };
};
