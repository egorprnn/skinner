import { AnyConstructor } from '../types';

export type ResolveTransformerHandler<T extends AnyConstructor<any>> = (
  args: ConstructorParameters<T>,
) => void;

class ResolveTransformer {
  private readonly transforms = new Map<AnyConstructor<any>, Set<ResolveTransformerHandler<any>>>();

  public run = <T extends AnyConstructor<any>>(target: T, args: ConstructorParameters<T>) => {
    const transformsSet = this.transforms.get(target);

    if (transformsSet) {
      transformsSet.forEach((cb) => cb(args));
    }
  };

  public apply = <T extends AnyConstructor<any>>(target: T, transform: ResolveTransformerHandler<T>) => {
    const transformsSet = this.transforms.get(target) ?? new Set();
    transformsSet.add(transform);

    this.transforms.set(target, transformsSet);

    return () => transformsSet.delete(transform);
  };
}

export const resolveTransformer = new ResolveTransformer();
