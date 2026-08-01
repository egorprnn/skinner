import type { APISchemas } from '@skinner/api-schema';
import { makeAutoObservable, runInAction } from 'mobx';
import { createProvider, destroy, init, scope } from '@skinner/di';

import { SessionService } from '../../../../models';
import type { SkinViewerProps } from '@skinner/skinviewer';

@scope.container()
export class ConstructorService {
  private _categories?: APISchemas['ConstructorCategoriesDto'];
  private _fetchCategoriesAbortController?: AbortController;

  private _activeCategoryIndex = 0;
  private _activeCategoryChildrenIndex = 0;

  private _fetchCategoriesItemsAbortController?: AbortController;
  private _categoriesItemsLoading = false;
  private _categoriesItems = new Map<APISchemas['ConstructorCategoryDto']['id'], APISchemas['ConstructorItemDto'][]>();
  private _categoriesItemsCurrentPage = new Map<APISchemas['ConstructorCategoryDto']['id'], number>();

  private _viewer?: Required<SkinViewerProps>['getRef']['current'];

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

  get activeCategoryId() {
    return (
      this._categories?.[this._activeCategoryIndex]?.children?.[this._activeCategoryChildrenIndex]?.id ||
      this._categories?.[this._activeCategoryIndex]?.id
    );
  }

  get categoriesItemsLoading() {
    return this._categoriesItemsLoading;
  }

  get activeCategoryHasMoreItems() {
    if (!this.activeCategoryId) {
      return false;
    }

    return this._categoriesItemsCurrentPage.get(this.activeCategoryId) !== -1;
  }

  get activeCategoryItems() {
    if (!this.activeCategoryId) {
      return [];
    }

    return this._categoriesItems.get(this.activeCategoryId) ?? [];
  }

  get viewer() {
    return this._viewer;
  }

  set viewer(viewer) {
    this._viewer = viewer;
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

    this._categoriesItemsLoading = false;

    this.fetchCurrentCategoryItems();
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

  async fetchCurrentCategoryItems() {
    const categoryId = this.activeCategoryId;

    if (!categoryId || !this.activeCategoryHasMoreItems) {
      return Promise.resolve();
    }

    let page = (this._categoriesItemsCurrentPage.get(categoryId) ?? 0) + 1;

    this._fetchCategoriesAbortController = new AbortController();
    this._categoriesItemsLoading = true;

    const { data, error } = await this.sessionService.api.GET('/constructor-items', {
      params: {
        query: {
          page,
          ['filter.category.id']: [categoryId],
        },
      },
      signal: this._fetchCategoriesAbortController?.signal,
    });

    runInAction(() => {
      this._categoriesItemsLoading = false;
    });

    if (error) {
      // todo
      console.log(error);

      return;
    }

    const {
      data: items,
      meta: { itemsPerPage },
    } = data;

    runInAction(() => {
      let categoriesItems = this._categoriesItems.get(categoryId) ?? [];

      categoriesItems = categoriesItems.concat(items);

      if (!items.length || items.length < itemsPerPage) {
        page = -1;
      }

      this._categoriesItems.set(categoryId, categoriesItems);
      this._categoriesItemsCurrentPage.set(categoryId, page);
    });
  }

  async [init]() {
    await this.fetchCategories();
    await this.fetchCurrentCategoryItems();
  }

  [destroy]() {
    this._fetchCategoriesAbortController?.abort('destroy');
    this._fetchCategoriesItemsAbortController?.abort('destroy');
  }
}

export const { Provider: ConstructorServiceProvider, useModel: useConstructorServiceProvider } =
  createProvider(ConstructorService);
