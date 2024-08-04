import { destroy, init, update } from '../symbols';
import { Destroyable, Model, Updatable, Initable } from '../types';

export const isDestroyable = (instance: any): instance is Destroyable => {
  return instance && typeof instance[destroy] === 'function';
};

export const isUpdatable = (instance: any): instance is Updatable<any> => {
  return instance && typeof instance[update] === 'function';
};

export const isInitable = (instance: any): instance is Initable<any> => {
  return instance && typeof instance[init] === 'function';
};

export const isModel = (instance: any): instance is Model<any> => {
  return isInitable(instance) && isUpdatable(instance);
};
