import {
  SizeType,
  AppRoot,
  ConfigProvider,
  AdaptivityProvider,
  type AppRootProps,
  type AdaptivityProviderProps,
  type ConfigProviderProps,
} from '@vkontakte/vkui';
import type { HTMLAttributes } from 'react';

export type AppRootProviderBaseProps = ConfigProviderProps &
  AdaptivityProviderProps &
  AppRootProps &
  HTMLAttributes<HTMLDivElement>;

export const AppRootProviderBase = ({
  platform,
  appearance,
  transitionMotionEnabled,
  locale,
  sizeX = SizeType.REGULAR,
  sizeY = SizeType.COMPACT,
  viewWidth,
  viewHeight,
  hasHover,
  hasPointer,
  mode,
  scroll,
  portalRoot,
  disablePortal,
  children,
  className,
  ...restProps
}: AppRootProviderBaseProps): JSX.Element => (
  <ConfigProvider
    platform={platform}
    appearance={appearance}
    locale={locale}
    isWebView
    transitionMotionEnabled={transitionMotionEnabled}
  >
    <AdaptivityProvider
      sizeX={sizeX}
      sizeY={sizeY}
      viewWidth={viewWidth}
      viewHeight={viewHeight}
      hasHover={hasHover}
      hasPointer={hasPointer}
    >
      <AppRoot mode={mode} scroll={scroll} portalRoot={portalRoot} disablePortal={disablePortal} className={className}>
        {mode === 'partial' ? (
          <div className="vkui__root" {...restProps}>
            {children}
          </div>
        ) : (
          children
        )}
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>
);
