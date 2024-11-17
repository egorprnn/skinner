import * as Sentry from '@sentry/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { API_URL, IS_DEVELOPMENT_MODE } from '@skinner/constants';

Sentry.init({
  dsn: !IS_DEVELOPMENT_MODE
    ? 'https://0e2c97c1d5c0ec8d764600ea5e86c2a1@o280468.ingest.us.sentry.io/4507898470531072'
    : '',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
    }),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [API_URL],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

import { i18next } from '@skinner/i18next';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from '@tanstack/react-router';
import { DIProvider, rootContainer } from '@skinner/di';

import { router } from './router';

const root = createRoot(document.getElementById('root')!);

root.render(
  <DIProvider instance={rootContainer}>
    <I18nextProvider i18n={i18next}>
      <RouterProvider router={router} />
      <SpeedInsights />
    </I18nextProvider>
  </DIProvider>,
);
