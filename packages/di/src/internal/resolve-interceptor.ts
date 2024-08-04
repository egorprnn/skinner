import { Constructor } from '../types';
import { Scope } from './scope';

export type InterceptorData<T> = { instance: T; ctor: Constructor<T>; type: Scope };

export type ResolveInterceptorHandler<T> = (data: InterceptorData<T>) => void;

class ResolveInterceptor {
  private readonly interceptors: Set<ResolveInterceptorHandler<any>> = new Set();

  public run = <T>(data: InterceptorData<T>) => this.interceptors.forEach((cb) => cb(data));

  public apply = <T>(interceptor: ResolveInterceptorHandler<T>) => {
    this.interceptors.add(interceptor);

    return () => this.interceptors.delete(interceptor);
  };
}

export const resolveInterceptor = new ResolveInterceptor();
