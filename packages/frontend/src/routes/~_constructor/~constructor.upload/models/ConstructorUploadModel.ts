import type { InferRequestType } from 'hono';
import { createProvider, scope } from '@skinner/di';

import { SessionService } from '../../../../models';

@scope.transient()
export class ConstructorUploadModel {
  constructor(private sessionService: SessionService) {}

  upload(data: InferRequestType<typeof this.sessionService.api.constructors.item.$put>['form']) {
    this.sessionService.api.constructors.item.$put({
      form: data,
    });
  }
}

export const { Provider: ConstructorUploadViewModelProvider, useModel: useConstructorUploadViewModelProvider } =
  createProvider(ConstructorUploadModel);
