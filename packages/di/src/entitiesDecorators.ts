import { scoped, ScopeOptions } from './internal/decorators';
import { scopes } from './internal/scope';

export const scope = {
  container: (options: ScopeOptions = {}) => scoped(scopes.CONTAINER, options),
  global: (options: ScopeOptions = {}) => scoped(scopes.GLOBAL, options),
  platform: (options: ScopeOptions = {}) => scoped(scopes.PLATFORM, options),
  transient: (options: ScopeOptions = {}) => scoped(scopes.TRANSIENT, options),
};
