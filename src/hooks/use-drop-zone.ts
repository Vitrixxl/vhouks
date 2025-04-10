'use client';
import React from 'react';

export type UseDropZoneParams = {
  onDrop: (files: File[]) => void | Promise<void>;
};

export const useDropZone = ({ onDrop }: UseDropZoneParams) => {
  const [isDraggingFile, setIsDragginFile] = React.useState(false);
  const dragLayers = React.useRef(0);
  const isHover = React.useRef(false);

  const registerContainer = (props?: React.HTMLAttributes<Element>) => {
    return {
      onDragEnterCapture: (e) => {
        isHover.current = true;
        props && props.onMouseEnter && props.onMouseEnter(e);
      },
      onDragLeaveCapture: (e) => {
        isHover.current = false;
        props && props.onMouseLeave && props.onMouseLeave(e);
      },
    } as React.HTMLAttributes<Element>;
  };

  const handleDragEnter = (e: DragEvent) => {
    if (Boolean(e.dataTransfer?.items[0]?.kind == 'file')) {
      dragLayers.current++;
      setIsDragginFile(true);
    }
  };
  const handleDragLeave = (e: DragEvent) => {
    dragLayers.current--;
    if (isHover.current) e.preventDefault();

    if (dragLayers.current == 0) {
      setIsDragginFile(false);
    }
  };

  const handleDragOver = (e: Event) => {
    if (isHover.current) e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    if (!isHover.current || !e.dataTransfer?.files) return;
    dragLayers.current = 0;

    e.preventDefault();
    isHover.current = false;
    setIsDragginFile(false);
    onDrop(Array.from(e.dataTransfer.files));
  };

  React.useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  return {
    isDraggingFile,
    registerContainer,
  };
};
