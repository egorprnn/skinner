import { makeAutoObservable } from 'mobx';
import { createProvider, scope } from '@skinner/di';
import type { APISchemas } from '@skinner/api-schema';
import type { CustomSelectOptionInterface } from '@vkontakte/vkui';

import { ConstructorService } from '../../models';
import { SessionService } from '../../../../models';

import { router } from '../../../../router';

@scope.transient()
export class ConstructorCategoryCreateModel {
  constructor(
    private sessionService: SessionService,
    private constructorService: ConstructorService,
  ) {
    makeAutoObservable(this);
  }

  async create(data: APISchemas['ConstructorCategoryCreateDto']) {
    const { error } = await this.sessionService.api.POST('/constructor-category', {
      body: data,
    });

    // todo
    if (error) {
      return;
    }

    this.constructorService.fetchCategories();

    router.history.back();
  }

  get hasParentCategoriesOptions() {
    return Array.isArray(this.constructorService.categories);
  }

  get parentCategoriesOptions() {
    return (
      this.constructorService.categories?.map<CustomSelectOptionInterface>(
        ({ id: parentId }) => ({
          label: parentId,
          value: parentId,
        }),
        [],
      ) ?? []
    );
  }
}

export const {
  Provider: ConstructorCategoryCreateViewModelProvider,
  useModel: useConstructorCategoryCreateViewModelProvider,
} = createProvider(ConstructorCategoryCreateModel);
