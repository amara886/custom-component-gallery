import React from 'react';
import { Retool } from '@tryretool/custom-component-support';
import DocViewer from './DocViewer';

export const CustomDocViewer: React.FC = () => {
  const [base64Data] = Retool.useStateString({ name: 'base64Data' });
  const [backgroundColor] = Retool.useStateString({
    name: 'backgroundColor',
    initialValue: 'white',
  });
  // Configurable properties
  const [maxFileSizeMB] = Retool.useStateNumber({
    name: 'maxFileSizeMB',
    initialValue: 50,
  });

  const [showLoadingState] = Retool.useStateBoolean({
    name: 'showLoadingState',
    initialValue: true,
  });

  // Hidden state for internal tracking (read-only from Retool)
  const [isLoading, setIsLoading] = Retool.useStateBoolean({
    name: 'isLoading',
    initialValue: false,
    inspector: 'hidden',
  });

  const [errorMessage, setErrorMessage] = Retool.useStateString({
    name: 'errorMessage',
    initialValue: '',
    inspector: 'hidden',
  });

  // Events for Retool integration
  const onDocumentLoaded = Retool.useEventCallback({ name: 'onDocumentLoaded' });
  const onLoadError = Retool.useEventCallback({ name: 'onLoadError' });

  return (
    <DocViewer
      base64Data={base64Data}
      backgroundColor={backgroundColor}
      maxFileSizeMB={maxFileSizeMB}
      showLoadingState={showLoadingState}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      onDocumentLoaded={onDocumentLoaded}
      onLoadError={onLoadError}
    />
  );
};
