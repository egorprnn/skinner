import { type RefObject, useEffect, useId, useRef, useState } from 'react';

export interface UseFileInputOptions
  extends Omit<Partial<HTMLInputElement>, 'id' | 'accept' | 'onchange' | 'children'> {
  /**
   * Доступные расширения файлов для выбора
   */
  accept?: string[] | string;
  /**
   * Обработчик изменения выбора файлов
   */
  onChange: (files: File[]) => unknown;
  /**
   * Обработчик наличия файлов неудовлетворяющих `accept` условию
   */
  onAcceptReject?: () => unknown;
}

export interface UseFileInput {
  fileInputId: string;
  fileInputRef: RefObject<HTMLInputElement>;
  isFilesDragging: boolean;
  isFilesDraggingEntered: boolean;
}

export const useFileInput = ({ onChange, onAcceptReject, ...options }: UseFileInputOptions): UseFileInput => {
  const { disabled, accept } = options;

  const fileInputId = useId();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFilesDragging, setIsFilesDragging] = useState(false);
  const [isFilesDraggingEntered, setIsFilesDraggingEntered] = useState(false);

  const clearInput = (): void => {
    const input = fileInputRef.current;

    if (!input) {
      return;
    }

    input.value = '';
  };

  const filterFiles = (files: FileList): File[] => {
    if (!accept) {
      return [...files];
    }

    return [...files].filter((file) => {
      const [, extension] = file.type.split('/');

      return accept.includes(extension);
    });
  };

  const changeHandler = (event: Event): void => {
    event.preventDefault();

    setIsFilesDragging(false);
    setIsFilesDraggingEntered(false);

    const currentTarget = event.currentTarget as HTMLInputElement;
    const files = currentTarget.files || (event as DragEvent).dataTransfer?.files;

    if (!files) {
      return;
    }

    const filteredFiles = filterFiles(files);

    if (files.length !== filteredFiles.length) {
      onAcceptReject?.();
    }

    clearInput();

    onChange(filteredFiles);
  };

  const checkIsDropArea = (event: DragEvent): boolean => {
    const input = fileInputRef.current;
    const target = event.target as Element;

    if (!input) {
      return false;
    }

    return target.id === input.id || Boolean(target.closest(`[data-for="${input.id}"]`));
  };

  useEffect(() => {
    const input = fileInputRef.current;

    if (!input) {
      return;
    }

    const acceptSerialized = Array.isArray(accept) ? accept.map((type) => `.${type}`).join(', ') : accept;

    Object.assign(input, {
      id: fileInputId,
      ...options,
    });

    input.type = 'file';
    input.onchange = changeHandler;

    if (acceptSerialized) {
      input.accept = acceptSerialized;
    }
  }, [fileInputId, options]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const dragEnter = (event: DragEvent): void => {
      event.preventDefault();
      event.stopPropagation();

      const dataTransfer = event.dataTransfer;

      if (!dataTransfer) {
        return;
      }

      const hasFiles =
        dataTransfer.types.includes('Files') || [...dataTransfer.items].some(({ kind }) => kind === 'file');

      if (hasFiles) {
        setIsFilesDragging(true);
      }

      const isDropArea = checkIsDropArea(event);

      setIsFilesDraggingEntered(isDropArea);
    };

    const dragLeave = (event: DragEvent): void => {
      event.preventDefault();

      if (document.body.contains(event.relatedTarget as Node)) {
        return;
      }

      setIsFilesDragging(false);
      setIsFilesDraggingEntered(false);
    };

    const dragDrop = (event: DragEvent): void => {
      dragLeave(event);

      const isDropArea = checkIsDropArea(event);

      if (!isDropArea) {
        return;
      }

      changeHandler(event);
    };

    document.body.addEventListener('dragenter', dragEnter);
    document.body.addEventListener('dragover', dragEnter);
    document.body.addEventListener('dragleave', dragLeave);
    document.body.addEventListener('drop', dragDrop);

    return () => {
      document.body.removeEventListener('dragenter', dragEnter);
      document.body.removeEventListener('dragover', dragEnter);
      document.body.removeEventListener('dragleave', dragLeave);
      document.body.removeEventListener('drop', dragDrop);
    };
  }, [disabled]);

  return {
    fileInputId,
    fileInputRef,
    isFilesDragging,
    isFilesDraggingEntered,
  };
};
