// eslint-disable-next-line no-restricted-imports
import { makeAutoObservable } from 'mobx';
import { scope } from '../entitiesDecorators';

// Не символ, т.к. нужна поддержка нескольких рантаймов, в которых символ был бы разным
export const propsAttribute = 'propsAttribute';

@scope.transient()
export class Props<PropsType extends Record<any, any>> {
  public constructor() {
    makeAutoObservable(this);
  }

  public static [propsAttribute] = true;

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  public current: PropsType = {} as PropsType;

  public set(props: PropsType) {
    Object.assign(this.current, props);
    Object.keys(this.current).forEach((key) => {
      if (!props.hasOwnProperty(key)) {
        delete this.current[key];
      }
    });
  }
}
