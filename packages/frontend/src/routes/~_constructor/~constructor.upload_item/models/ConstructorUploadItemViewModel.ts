import { createProvider, scope } from '@skinner/di';

@scope.transient()
export class ConstructorUploadItemViewModel {}

export const { Provider: ConstructorUploadItemViewModelProvider, useModel: useConstructorUploadItemViewModelProvider } =
  createProvider(ConstructorUploadItemViewModel);
