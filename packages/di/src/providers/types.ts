import { Constructor, Destroyable, Initable, Updatable } from '../types';
import { Props } from './props';

export type ModelInstanceType<PropsType> = Partial<Initable<PropsType> & Updatable<PropsType> & Destroyable> &
  Record<string, any>;

export type ModelConstructorType<PropsType> = Constructor<ModelInstanceType<PropsType>>;

export type InferPropsFromMethods<ModelClass extends ModelConstructorType<any>> =
  InstanceType<ModelClass> extends ModelInstanceType<infer PropsType> ? PropsType : never;

export type InferPropsClassFromConstructor<ModelClass extends ModelConstructorType<any>> = Extract<
  ConstructorParameters<ModelClass>[number],
  Props<any>
>;

export type InferPropsFromConstructor<
  ModelClass extends ModelConstructorType<any>,
  PropsClass = InferPropsClassFromConstructor<ModelClass>,
> = [PropsClass] extends [never] ? never : PropsClass extends Props<infer Data> ? Data : never;

export type InferProps<
  ModelClass extends ModelConstructorType<any>,
  PropsMethodsType = InferPropsFromMethods<ModelClass>,
  PropsConstructorType = InferPropsFromConstructor<ModelClass>,
> = [PropsConstructorType] extends [never] ? PropsMethodsType : PropsConstructorType;
