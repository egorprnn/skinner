// eslint-disable-next-line no-restricted-imports
import { container, DependencyContainer, Lifecycle } from 'tsyringe';
import { mapScopeToTsyringeLifecycleType } from './internal/decorators';
import { isDestroyable } from './internal/guards';
import { globalScopeRegistrations } from './internal/interceptor';
import { Scope, scopes } from './internal/scope';
import { constructorScope } from './internal/symbols';
import { destroy } from './symbols';
import { AnyConstructor, Constructor, Destroyable } from './types';
import { resolveTransformer, ResolveTransformerHandler } from './internal/resolve-transformer';
import { resolveInterceptor, InterceptorData } from './internal/resolve-interceptor';

export type ContainerState = {
  resolveRoots: Record<string, any[]>;
  instances: Record<string, any>;
  children: Record<string, ContainerState>;
};

export class DIContainer {
  public constructor(
    private readonly parent: DIContainer | null,
    private readonly name: string,
  ) {
    if (this.parent) {
      this.container = this.parent.container.createChildContainer();
    } else {
      this.container = container;
      this.isIsolated = true;
    }
  }

  private isIsolated = false;

  private readonly children: Map<string, DIContainer> = new Map();
  private readonly container: DependencyContainer;

  private readonly instances: Map<Constructor<any>, Destroyable> = new Map();

  private readonly handleConstruction = (data: InterceptorData<any>) => {
    const { type, ctor, instance } = data;

    if (!isDestroyable(instance)) {
      return;
    }

    const shouldSaveInCurrent =
      (type === scopes.GLOBAL && this.isIsolated) ||
      type === scopes.CONTAINER ||
      type === scopes.TRANSIENT ||
      !this.parent;

    if (shouldSaveInCurrent) {
      this.instances.set(ctor, instance);
    } else {
      this.parent?.handleConstruction(data);
    }
  };

  /**
   * Позволяет получить инстанс любой декорированной сущности
   * */
  public resolve<T>(ClassConstructor: AnyConstructor<T>): T {
    const unapply = resolveInterceptor.apply(this.handleConstruction);

    // @ts-expect-error TS2769: No overload matches this call
    const instance = this.container.resolve<T>(ClassConstructor);

    unapply();

    return instance;
  }

  /**
   * Позволяет получить инстанс любой декорированной сущности.
   * Но при этом произвести манипуляции над зависимостями этой сущности (только на первом уровне)
   * */
  public resolveWithTransforms<T extends AnyConstructor<any>>(
    ClassConstructor: T,
    transform: ResolveTransformerHandler<T>,
  ): InstanceType<T> {
    const unapply = resolveTransformer.apply(ClassConstructor, transform);
    const instance = this.resolve(ClassConstructor);

    unapply();

    return instance;
  }

  private getConstructorScope(Ctor: AnyConstructor<any>): Scope | null {
    if (constructorScope in Ctor) {
      return Ctor[constructorScope] as Scope;
    }

    return null;
  }

  /**
   * Метод для подмены зависимости.
   * Стоит использовать для замены абстрактных классов на их имплементацию.
   * */
  public replace<T>(token: AnyConstructor<T>, ClassConstructor: Constructor<T>) {
    const scope = this.getConstructorScope(ClassConstructor);

    if (scope !== this.getConstructorScope(token)) {
      throw new Error('token и constructor должны иметь одинаковый scope');
    }

    // @ts-expect-error TS2769: No overload matches this call.
    this.container.register<T>(token, ClassConstructor, {
      lifecycle: scope ? mapScopeToTsyringeLifecycleType(scope) : Lifecycle.Transient,
    });
  }

  /**
   * Метод для изоляции сущностей с декоратором scoped(Scope.GLOBAL)
   * */
  public isolate() {
    this.isIsolated = true;

    Array.from(globalScopeRegistrations.values()).forEach((token) => this.container.registerSingleton(token));
  }

  /**
   * Позволяет удалить контейнер
   * */
  public async destroy() {
    if (this.parent) {
      Array.from(this.instances.values()).forEach((instance) => {
        if (isDestroyable(instance)) {
          instance[destroy]();
        }
      });

      await this.container.dispose();
      this.parent.children.delete(this.name);
    } else {
      throw new Error('Cannot destroy root container!');
    }
  }

  /**
   * Создаёт потомка контейнера
   * @param {string} name - имя контейнера, используемое для сериализации и десериализации состояния
   * @param {boolean} isIsolated - флаг изоляции сущностей с декораторов scoped(Scope.GLOBAL)
   * */
  public child(name: string, isIsolated?: boolean) {
    if (this.children.has(name)) {
      throw new Error(`Container child with same name "${name}" already exists!`);
    }

    const child = new DIContainer(this, name);

    if (this.parent) {
      this.children.set(name, child);
    }

    if (isIsolated) {
      child.isolate();
    }

    return child;
  }
}

export const rootContainer = new DIContainer(null, 'root');
