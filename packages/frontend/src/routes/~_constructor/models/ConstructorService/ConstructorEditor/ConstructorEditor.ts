import { makeAutoObservable } from 'mobx';
import { createProvider, scope } from '@skinner/di';
import type { APISchemas } from '@skinner/api-schema';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';

import { ConstructorService } from '../ConstructorService';

@scope.container()
export class ConstructorEditor {
  static mappings = {
    [MinecraftTextureVariant.CLASSIC]: {
      head: {
        // x, y, x, y
        inner: [0, 0, 31, 15],
        outer: [32, 0, 63, 15],
      },
      body: {
        inner: [16, 16, 39, 31],
        outer: [16, 32, 39, 47],
      },
      left_arm: {
        inner: [32, 48, 47, 63],
        outer: [48, 48, 63, 63],
      },
      right_arm: {
        inner: [40, 16, 55, 31],
        outer: [40, 32, 55, 47],
      },
      left_leg: {
        inner: [16, 48, 31, 63],
        outer: [0, 48, 15, 63],
      },
      right_leg: {
        inner: [0, 16, 15, 31],
        outer: [0, 32, 15, 47],
      },
    },
    [MinecraftTextureVariant.SLIM]: {},
  };

  private _variant = MinecraftTextureVariant.CLASSIC;
  private _stack = new Set<APISchemas['ConstructorItemDto']>();

  constructor(private readonly constructorService: ConstructorService) {
    makeAutoObservable(this);
  }

  get variant() {
    return this._variant;
  }

  set variant(variant: MinecraftTextureVariant) {
    this._variant = variant;
  }

  hasStackItem(item: APISchemas['ConstructorItemDto']) {
    return this._stack.has(item);
  }

  toggleStackItem(item: APISchemas['ConstructorItemDto']) {
    if (this._stack.has(item)) {
      this._stack.delete(item);
    } else {
      this._stack.add(item);
    }
  }

  clearStack() {
    this._stack.clear();
  }
}

export const { Provider: ConstructorEditorProvider, useModel: useConstructorEditorProvider } =
  createProvider(ConstructorEditor);
