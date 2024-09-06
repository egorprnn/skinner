import { z } from 'zod';
import { makeAutoObservable } from 'mobx';
import type { InferRequestType } from 'hono';
import { createProvider, scope } from '@skinner/di';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import type { CustomSelectOptionInterface } from '@vkontakte/vkui';
import { constructorsItemPutSchema } from '@skinner/backend/schema/constructors/item';

import { ConstructorService } from '../../models';
import { SessionService } from '../../../../models';

type CategoriesOptions = Array<
  CustomSelectOptionInterface & {
    parentLabel?: string;
  }
>;

@scope.container()
export class ConstructorUploadModel {
  private static readonly DEFAULT_FORM_VALUES = {
    title: '',
    category: '',
    description: '',
    file: new Blob(),
    variant: MinecraftTextureVariant.CLASSIC,
  } as const;
  private _formValues: z.infer<typeof constructorsItemPutSchema> = ConstructorUploadModel.DEFAULT_FORM_VALUES;

  constructor(
    private sessionService: SessionService,
    private constructorService: ConstructorService,
  ) {
    makeAutoObservable(this);
  }

  upload(data: InferRequestType<typeof this.sessionService.api.constructors.item.$put>['form']) {
    this.sessionService.api.constructors.item.$put({
      form: data,
    });
  }

  get formValues() {
    return this._formValues;
  }

  set formValues(value) {
    this._formValues = value;
  }

  resetFormValue() {
    this._formValues = ConstructorUploadModel.DEFAULT_FORM_VALUES;
  }

  get hasCategoriesOptions() {
    return Array.isArray(this.constructorService.categories);
  }

  get categoriesOptions() {
    return (
      this.constructorService.categories?.reduce<CategoriesOptions>((categoriesOptions, { id: parentId, children }) => {
        if (children.length) {
          children.forEach(({ id }, index) => {
            categoriesOptions.push({
              label: `${parentId} → ${id}`,
              value: id,
              parentLabel: !index ? parentId : undefined,
            });
          });
        } else {
          categoriesOptions.push({
            label: parentId,
            value: parentId,
          });
        }

        return categoriesOptions;
      }, []) ?? []
    );
  }
}

export const { Provider: ConstructorUploadViewModelProvider, useModel: useConstructorUploadViewModelProvider } =
  createProvider(ConstructorUploadModel);
