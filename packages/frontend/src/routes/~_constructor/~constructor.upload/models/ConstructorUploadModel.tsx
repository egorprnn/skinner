import { z } from 'zod';
import { makeAutoObservable } from 'mobx';
import { serialize } from 'object-to-formdata';
import { createProvider, scope } from '@skinner/di';
import type { APISchemas } from '@skinner/api-schema';
import { MinecraftTextureVariant } from '@skinner/minecraft-auth';
import type { CustomSelectOptionInterface } from '@vkontakte/vkui';
import type { ConstructorItemCreateSchema } from '@skinner/backend/src/routes/constructor/item/schema/constructor-item-create.schema';

import { ConstructorService } from '../../models';
import { SessionService } from '../../../../models';

type CategoriesOptions = Array<
  CustomSelectOptionInterface & {
    parentLabel?: string;
  }
>;

@scope.transient()
export class ConstructorUploadModel {
  private static readonly DEFAULT_FORM_VALUES = {
    title: '',
    category: '',
    description: '',
    file: new File([], ''),
    variant: MinecraftTextureVariant.CLASSIC,
  } as const;
  private static _formValues: z.infer<typeof ConstructorItemCreateSchema> = ConstructorUploadModel.DEFAULT_FORM_VALUES;

  constructor(
    private sessionService: SessionService,
    private constructorService: ConstructorService,
  ) {
    makeAutoObservable(this);
  }

  upload(data: APISchemas['ConstructorItemCreateDto']) {
    this.sessionService.api.POST('/constructor-item', {
      body: data,
      bodySerializer: serialize,
    });
  }

  get formValues() {
    return ConstructorUploadModel._formValues;
  }

  set formValues(values) {
    ConstructorUploadModel._formValues = values;
  }

  resetFormValue() {
    ConstructorUploadModel._formValues = ConstructorUploadModel.DEFAULT_FORM_VALUES;
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
