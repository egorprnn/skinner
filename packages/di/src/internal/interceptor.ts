import { constructorScope, isAbstract } from './symbols';
import { Constructor } from '../types';
import { Scope } from './scope';
import { resolveInterceptor } from './resolve-interceptor';
import { resolveTransformer } from './resolve-transformer';

export const globalScopeRegistrations = new Set<Constructor<any>>();

/**
 * Функция для оборачивания конструкторов классов
 * Позволяет синхронно перехватывать инстанцирование классов в процессе резолва зависимостей через DI
 * */
export const constructorWrapper = <T extends Constructor<any>>(
  type: Scope,
  Target: T,
  options?: { abstract?: boolean },
): T => {
  const proxy = new Proxy(Target, {
    construct(Ctor, args: ConstructorParameters<T>, newTarget) {
      for (let arg of args) {
        if (arg?.constructor?.[isAbstract]) {
          throw new Error(`Cannot inject abstract class ${arg.constructor.toString()}`);
        }
      }

      resolveTransformer.run(proxy, args);

      const instance = Reflect.construct(Ctor, args, newTarget);

      resolveInterceptor.run({
        type,
        instance,
        ctor: proxy,
      });

      return instance;
    },
  });

  // @ts-expect-error TS7053: Element implicitly has an any type because expression of type unique symbol can't be used to index type Constructor<any>
  Target[constructorScope] = type;
  // @ts-expect-error TS7053: Element implicitly has an any type because expression of type unique symbol can't be used to index type Constructor<any>
  Target[isAbstract] = options?.abstract;

  Reflect.defineMetadata('design:paramtypes', Reflect.getMetadata('design:paramtypes', Target) || [], proxy);

  return proxy;
};
