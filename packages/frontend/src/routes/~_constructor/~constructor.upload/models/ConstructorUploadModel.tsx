import { makeAutoObservable } from 'mobx';
import type { InferRequestType } from 'hono';
import { createProvider, scope } from '@skinner/di';
import type { CustomSelectOptionInterface } from '@vkontakte/vkui';

import { ConstructorService } from '../../models';
import { SessionService } from '../../../../models';

type CategoriesOptions = Array<
  CustomSelectOptionInterface & {
    parentLabel?: string;
  }
>;

@scope.transient()
export class ConstructorUploadModel {
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

  get hasCategoriesOptions() {
    return Boolean(this.constructorService.categories?.length);
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
