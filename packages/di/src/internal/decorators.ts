// eslint-disable-next-line no-restricted-imports
import {
  injectable as tsyringeInjectable,
  Lifecycle,
  scoped as tsyringeScoped,
  singleton as tsyringeSingleton,
} from 'tsyringe';
import { AbstractConstructor, AnyConstructor, Destroyable } from '../types';
import { constructorWrapper, globalScopeRegistrations } from './interceptor';
import { Scope, scopes } from './scope';

export interface ScopeOptions {
  abstract?: boolean;
}

export const scoped =
  (scope: Scope, options: ScopeOptions = {}) =>
  <
    InstanceType extends Partial<Destroyable & { [key: string]: any }>,
    TargetType extends AnyConstructor<InstanceType>,
    ReturnType extends Exclude<TargetType, AbstractConstructor<InstanceType>>,
  >(
    Target: TargetType,
  ): ReturnType => {
    // @ts-expect-error TS2345: Argument of type 'AnyConstructor<InstanceType>' is not assignable to parameter of type 'Constructor<any>'.
    const wrappedConstructor = constructorWrapper(scope, Target, { abstract: options.abstract });

    switch (scope) {
      case scopes.CONTAINER:
        tsyringeScoped(Lifecycle.ContainerScoped)(wrappedConstructor);
        break;
      case scopes.GLOBAL:
        globalScopeRegistrations.add(wrappedConstructor);
        tsyringeSingleton()(wrappedConstructor);
        break;
      case scopes.PLATFORM:
        tsyringeSingleton()(wrappedConstructor);
        break;
      case scopes.TRANSIENT:
        tsyringeInjectable()(wrappedConstructor);
        break;
    }

    return wrappedConstructor as unknown as ReturnType;
  };

export function mapScopeToTsyringeLifecycleType(scope: Scope): Lifecycle {
  switch (scope) {
    case 'GLOBAL':
      return Lifecycle.Singleton;
    case 'PLATFORM':
      return Lifecycle.Singleton;
    case 'CONTAINER':
      return Lifecycle.ContainerScoped;
    case 'TRANSIENT':
      return Lifecycle.Transient;
  }

  throw new Error('Unknown scope');
}
