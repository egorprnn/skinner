// eslint-disable-next-line no-restricted-imports
import { makeAutoObservable, observable } from 'mobx';

import { scope } from '../entitiesDecorators';

// Не символ, т.к. нужна поддержка нескольких рантаймов, в которых символ был бы разным
export const propsAttribute = 'propsAttribute';

/**
 * Контейнер для получения `props` в модели виджета из DI
 *
 * {@link Props.current} является наблюдаемой коллекцией {@link https://mobx.js.org/api.html#observableshallow | (observable.shallow)}.
 *
 * Это означает, что реакции на изменения будут производиться отдельно для каждого параметра, но не глубже.
 */
@scope.transient()
export class Props<PropsType extends Record<any, any>> {
  public constructor() {
    makeAutoObservable(this, {
      current: observable.shallow,
    });
  }

  public static [propsAttribute] = true;

  /**
   * Актуальные `props`
   *
   * Яявляется наблюдаемой коллекцией {@link https://mobx.js.org/api.html#observableshallow | (observable.shallow)}.
   *
   * Это означает, что реакции на изменения будут производиться отдельно для каждого параметра, но не глубже.
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  public readonly current: Readonly<PropsType> = {} as PropsType;

  /**
   * Устанавливает новые `props`
   *
   * @deprecated в продуктовом коде не вызывать!
   */
  public set(props: PropsType) {
    const current = this.current as PropsType;

    Object.assign(current, props);
    Object.keys(current).forEach((key) => {
      if (!props.hasOwnProperty(key)) {
        delete current[key];
      }
    });
  }
}
