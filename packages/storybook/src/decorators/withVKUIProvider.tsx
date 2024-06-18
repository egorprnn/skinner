import type { ReactRenderer } from '@storybook/react';
import type { DecoratorFunction } from '@storybook/csf';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
export const withVKUIProvider: DecoratorFunction<ReactRenderer> = (Component) => (
  <div className="vkui__root">
    <ConfigProvider platform="android" appearance="dark" hasCustomPanelHeaderAfter={false} isWebView>
      <AdaptivityProvider>
        <AppRoot
          style={{
            background: 'var(--vkui--color_background)',
          }}
        >
          <Component />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </div>
);
