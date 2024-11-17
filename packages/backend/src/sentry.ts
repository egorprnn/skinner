import * as Sentry from '@sentry/nestjs';
import { IS_DEVELOPMENT_MODE } from '@skinner/constants';

Sentry.init({
  dsn: process.env['SENTRY_DSN'],
  tracesSampleRate: 1.0,
  // TODO: Issue with standard instrumentation:
  // https://github.com/getsentry/sentry-javascript/issues/12891
  // https://github.com/oven-sh/bun/issues/13165
  defaultIntegrations: Sentry.getDefaultIntegrations({}).filter(({ name }) => name !== 'Http'),
  beforeSend: (event, hint) => {
    if (IS_DEVELOPMENT_MODE) {
      console.error(hint.originalException || hint.syntheticException);

      return null;
    }

    return event;
  },
});
