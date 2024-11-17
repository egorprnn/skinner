import type { APISchemas } from '@skinner/api-schema';
import { makeAutoObservable, runInAction } from 'mobx';
import { createProvider, destroy, init, scope } from '@skinner/di';

import { SessionService } from '../../../models';

@scope.container()
export class ConstructorService {
  _categories?: APISchemas['ConstructorCategoriesDto'];
  _fetchCategoriesAbortController?: AbortController;

  _activeCategoryIndex = 0;
  _activeCategoryChildrenIndex = 0;

  constructor(private sessionService: SessionService) {
    makeAutoObservable(this);
  }

  get categories() {
    return this._categories;
  }

  get hasCategories() {
    return Boolean(this._categories);
  }

  get activeCategoryIndex() {
    return this._activeCategoryIndex;
  }

  get activeCategoryChildrenIndex() {
    return this._activeCategoryChildrenIndex;
  }

  get activeCategoryChildren() {
    return this._categories?.[this._activeCategoryIndex]?.children;
  }

  get activeCategoryHasChildren() {
    return Number(this.activeCategoryChildren?.length) > 0;
  }

  selectCategory(id: NonNullable<typeof this._categories>[number]['id']) {
    if (!this._categories) {
      return;
    }

    let categoryIndex = this._categories.findIndex(
      (category) => category.id === id || id.startsWith(`${category.id}_`),
    );

    if (categoryIndex === -1) {
      categoryIndex = 0;
    }

    let categoryChildrenIndex = this._categories[categoryIndex]?.children.findIndex((category) => category.id === id);

    if (categoryChildrenIndex === -1) {
      categoryChildrenIndex = 0;
    }

    this._activeCategoryIndex = categoryIndex;
    this._activeCategoryChildrenIndex = categoryChildrenIndex;
  }

  async fetchCategories() {
    this._fetchCategoriesAbortController?.abort('new request');

    this._fetchCategoriesAbortController = new AbortController();

    const { data: categories, error } = await this.sessionService.api.GET('/constructor-categories', {
      signal: this._fetchCategoriesAbortController.signal,
    });

    if (error) {
      // todo
      console.log(error);

      return;
    }

    if (!categories) {
      return;
    }

    runInAction(() => {
      this._categories = categories;
    });
  }

  [init]() {
    this.fetchCategories();
  }

  [destroy]() {
    this._fetchCategoriesAbortController?.abort('destroy');
  }
}

export const { Provider: ConstructorServiceProvider, useModel: useConstructorServiceProvider } =
  createProvider(ConstructorService);
