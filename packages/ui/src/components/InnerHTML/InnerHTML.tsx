import type { AllHTMLAttributes, ElementType } from 'react';
import type { HasRef } from '@vkontakte/vkui';

export interface InnerHTMLProps extends Omit<AllHTMLAttributes<HTMLElement>, 'children'>, HasRef<HTMLElement> {
  /**
   * Элемент для InnerHTML
   */
  Component?: ElementType;
  /**
   * HTML для вставки через `dangerouslySetInnerHTML`
   */
  children: string | number;
}

export function InnerHTML({ Component = 'span', children, getRef, ...restProps }: InnerHTMLProps): JSX.Element {
  return <Component {...restProps} ref={getRef} dangerouslySetInnerHTML={{ __html: String(children) }} />;
}
