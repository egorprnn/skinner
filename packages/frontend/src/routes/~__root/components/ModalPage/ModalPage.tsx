import { createPortal } from 'react-dom';
import {
  ModalRoot,
  SplitLayout,
  ModalPage as ModalPageBase,
  type ModalPageProps as ModalPageBaseProps,
} from '@vkontakte/vkui';
import { useNavigate, useRouter, type RootRoute, type RoutesByPath } from '@tanstack/react-router';
import { useState } from 'react';

export type ModalPageProps = Omit<ModalPageBaseProps, 'id' | 'nav'>;

export const ModalPage = (props: ModalPageProps) => {
  const router = useRouter();
  const navigate = useNavigate();

  const [activeModal, setActiveModel] = useState<string | undefined>('modal');

  const handleClose = () => {
    setActiveModel(undefined);
  };

  const handleClosed = () => {
    const { pathname } = router.buildLocation({
      to: router.latestLocation.pathname,
    });

    navigate({
      to: router.routesByPath[pathname as keyof RoutesByPath<RootRoute>].parentRoute.to,
    });
  };

  return createPortal(
    <SplitLayout
      modal={
        <ModalRoot activeModal={activeModal} onClose={handleClose} onClosed={handleClosed}>
          <ModalPageBase nav="modal" {...props} />
        </ModalRoot>
      }
    />,
    document.body,
  );
};
