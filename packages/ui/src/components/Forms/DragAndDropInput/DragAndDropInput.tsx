import { classNames } from '@vkontakte/vkjs';
import type { JSX, ReactElement } from 'react';
import { Tappable, type PlaceholderProps } from '@vkontakte/vkui';

import { useFileInput, type UseFileInputOptions } from './hooks';

import styles from './DragAndDropInput.module.css';

export interface DragAndDropInputPropsChildrenProps {
  /**
   * Состояние пересечения компонента файлом со стороны пользователя
   */
  active: boolean;
}

export interface DragAndDropInputProps extends UseFileInputOptions {
  children?:
    | ReactElement<PlaceholderProps>
    | ((props: DragAndDropInputPropsChildrenProps) => ReactElement<PlaceholderProps>);
  /**
   * Состояние отображение компонента поверх контента родительского блока,
   * начнет отображаться только после начала ввода файла пользователем
   */
  overlay?: boolean;
  /**
   * Растягивает компонент на доступную высоту
   */
  stretched?: boolean;
  /**
   * Включает обработку клика ввода файлов
   */
  enableInteractive?: boolean;
}

export const DragAndDropInput = ({
  overlay,
  children,
  stretched,
  enableInteractive,
  className: classNameProp,
  ...restProps
}: DragAndDropInputProps): JSX.Element => {
  const { fileInputId, fileInputRef, isFilesDragging, isFilesDraggingEntered } = useFileInput(restProps);

  const content = (
    <>
      <div className={styles.in}>
        {typeof children === 'function' ? children({ active: isFilesDraggingEntered }) : children}
      </div>
      <input ref={fileInputRef} className={styles.input} tabIndex={-1} aria-hidden />
    </>
  );

  const className = classNames(
    styles.root,
    overlay && styles.rootOverlay,
    stretched && styles.rootStretched,
    isFilesDragging && styles.rootVisible,
    isFilesDraggingEntered && styles.rootHovered,
    classNameProp,
  );

  if (enableInteractive) {
    return (
      <Tappable
        Component="label"
        data-for={fileInputId}
        className={className}
        htmlFor={fileInputId}
        hoverMode="background"
        activeMode="background"
      >
        {content}
      </Tappable>
    );
  }

  return (
    <div className={className} data-for={fileInputId}>
      {content}
    </div>
  );
};
