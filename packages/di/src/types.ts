import { destroy, init, update } from './symbols';

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface Destroyable {
  [destroy](): void;
}

export interface Initable<PropsType> {
  [init](props: PropsType): Promise<void> | void;
}

export interface Updatable<PropsType> {
  [update](props: PropsType): void;
}

export interface Model<PropsType> extends Initable<PropsType>, Updatable<PropsType> {}

export type Constructor<T> = new (...args: any[]) => T;
export type AbstractConstructor<T> = abstract new (...args: any[]) => T;

export type AnyConstructor<T> = Constructor<T> | AbstractConstructor<T>;
