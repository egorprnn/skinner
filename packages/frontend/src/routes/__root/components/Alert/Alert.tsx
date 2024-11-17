import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert as VKUIAlert, type AlertProps } from '@vkontakte/vkui';

export const Alert = (props: AlertProps) => {
  const { onClose } = props;

  const [shown, setShown] = useState(true);

  const handleClose = () => {
    setShown(false);

    onClose();
  };

  if (!shown) {
    return null;
  }

  return createPortal(<VKUIAlert {...props} onClose={handleClose} />, document.body);
};

export { type AlertProps } from '@vkontakte/vkui';
