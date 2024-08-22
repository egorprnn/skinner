import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { runInAction } from 'mobx';
import { init, update } from '../symbols';
import { isInitable, isUpdatable } from '../internal/guards';
import { InferProps, ModelInstanceType } from './types';
import { useContainer } from './container';
import { useMemoizeProps, usePostponedEffect } from '../internal/utils';
import { Props, propsAttribute } from './props';
import { Constructor } from '../types';

export const createProvider = <
  ModelClassType extends Constructor<ModelInstanceType<any>>,
  ModelType = InstanceType<ModelClassType>,
  ModelPropsType = InferProps<ModelClassType>,
>(
  ModelClass: ModelClassType,
) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const ModelContext = createContext<ModelType>({} as ModelType);

  const Provider = (props: PropsWithChildren<ModelPropsType>) => {
    const container = useContainer();
    const { children, ...restProps } = props;
    const propsRef = useRef<ModelPropsType extends Record<any, any> ? Props<ModelPropsType> : undefined>();

    const [instance] = useState(() => {
      const res = container.resolveWithTransforms(ModelClass, (args) => {
        const propsInstance = args.find((arg) => arg.constructor[propsAttribute]);

        if (propsInstance) {
          propsInstance.set(restProps);
          propsRef.current = propsInstance;
        }
      });

      return res as ModelType;
    });

    usePostponedEffect(() => {
      runInAction(() => {
        propsRef.current?.set(restProps as ModelPropsType);

        if (isUpdatable(instance)) {
          instance[update](restProps);
        }
      });
    }, useMemoizeProps(restProps));

    useEffect(() => {
      if (isInitable(instance)) {
        instance[init](restProps);
      }

      return () => {
        container.destroyInstance(ModelClass);
      };
    }, []);

    return <ModelContext.Provider value={instance}>{children}</ModelContext.Provider>;
  };

  const useModel = (): ModelType => {
    const model = useContext(ModelContext);

    if (!model) {
      throw new Error(
        `The "useModel" hook expects an instance of ${ModelClass.name}, but it looks like no context is provided.`,
      );
    }

    return model;
  };

  return {
    Provider,
    useModel,
  };
};
