import { StrictMode } from 'react';
import { i18next } from '@skinner/i18next';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from '@tanstack/react-router';

import { router } from './router';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>,
);
