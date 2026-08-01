import { asyncImportLoader } from '@vkontakte/vkjs';
import { type ComponentProps, lazy, Suspense } from 'react';

const SkinViewer = lazy(() =>
  asyncImportLoader(() =>
    import('../SkinViewer').then(({ SkinViewer }) => ({
      default: SkinViewer,
    })),
  ),
);

export type SkinViewerLazyProps = ComponentProps<typeof SkinViewer>;

export const SkinViewerLazy = (props: SkinViewerLazyProps) => {
  const { width, height } = props;

  return (
    <Suspense
      fallback={
        <div
          style={{
            width,
            height,
          }}
        />
      }
    >
      <SkinViewer {...props} />
    </Suspense>
  );
};
