import * as Sentry from '@sentry/nestjs';
import { IS_DEVELOPMENT_MODE } from '@skinner/constants';

Sentry.init({
  dsn: process.env['SENTRY_DSN'],
  tracesSampleRate: 1.0,
  beforeSend: (event, hint) => {
    if (IS_DEVELOPMENT_MODE) {
      console.error(hint.originalException || hint.syntheticException);

      return null;
    }

    return event;
  },
});
