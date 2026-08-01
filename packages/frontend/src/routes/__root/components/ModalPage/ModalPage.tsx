import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ModalRoot,
  SplitLayout,
  ModalPage as ModalPageBase,
  type ModalPageProps as ModalPageBaseProps,
} from '@vkontakte/vkui';
import { useNavigate, useRouter, type RootRoute, type RoutesByPath } from '@tanstack/react-router';

export type ModalPageProps = Omit<ModalPageBaseProps, 'id' | 'nav'>;

export const ModalPage = ({ onClose, ...restProps }: ModalPageProps) => {
  const router = useRouter();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState<string | undefined>('modal');

  const handleClose = () => {
    setActiveModal(undefined);
  };

  const handleClosed = () => {
    onClose?.();

    const prevPathname = router.history.location.pathname;

    router.history.back();

    if (prevPathname === router.history.location.pathname) {
      const { pathname } = router.buildLocation({
        to: router.latestLocation.pathname,
      });

      navigate({
        to: router.routesByPath[pathname as keyof RoutesByPath<RootRoute>].parentRoute.to,
      });
    }
  };

  return createPortal(
    <SplitLayout
      modal={
        <ModalRoot activeModal={activeModal} onClose={handleClose} onClosed={handleClosed}>
          <ModalPageBase nav="modal" {...restProps} />
        </ModalRoot>
      }
    />,
    document.body,
  );
};
