import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { base64ToArrayBuffer } from './utils/base64ToArrayBuffer';

interface DocViewerProps {
  base64Data?: string;
  backgroundColor?: string;
  maxFileSizeMB?: number;
  showLoadingState?: boolean;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  errorMessage?: string;
  setErrorMessage?: (error: string) => void;
  onDocumentLoaded?: () => void;
  onLoadError?: () => void;
}

const DocViewer: React.FC<DocViewerProps> = ({
  base64Data,
  backgroundColor = 'white',
  maxFileSizeMB = 50,
  showLoadingState = true,
  isLoading = false,
  setIsLoading,
  errorMessage = '',
  setErrorMessage,
  onDocumentLoaded,
  onLoadError,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);

  const validateDocument = (base64: string, maxSizeMB: number): string | null => {
    // Check if data exists
    if (!base64 || base64.trim() === '') {
      return 'No document data provided';
    }

    // Convert to ArrayBuffer to check size
    try {
      const arrayBuffer = base64ToArrayBuffer(base64);

      // Check if conversion failed (empty buffer)
      if (arrayBuffer.byteLength === 0) {
        return 'Invalid base64 data - failed to decode';
      }

      // Check file size
      const fileSizeMB = arrayBuffer.byteLength / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        return `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`;
      }

      return null; // Valid
    } catch (error) {
      return `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const calculateScaleAndTranslate = () => {
    if (containerRef.current && viewerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = viewerRef.current.scrollWidth;
      if (contentWidth > 0) {
        const newScale = containerWidth / contentWidth;
        setScale(newScale);

        const scaledContentWidth = contentWidth * newScale;
        const newTranslateX = (containerWidth - scaledContentWidth) / 2;
        setTranslateX(newTranslateX);
      }
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(calculateScaleAndTranslate);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!base64Data) {
      setErrorMessage?.('');
      return;
    }

    // Set loading state
    setIsLoading?.(true);
    setErrorMessage?.('');

    // Validate document
    const validationError = validateDocument(base64Data, maxFileSizeMB);
    if (validationError) {
      setErrorMessage?.(validationError);
      setIsLoading?.(false);
      onLoadError?.();
      return;
    }

    // Render document
    if (viewerRef.current) {
      try {
        const docxArrayBuffer = base64ToArrayBuffer(base64Data);
        viewerRef.current.innerHTML = '';

        renderAsync(docxArrayBuffer, viewerRef.current, undefined, {
          inWrapper: false,
          breakPages: true,
        })
          .then(() => {
            calculateScaleAndTranslate();
            setIsLoading?.(false);
            onDocumentLoaded?.();
          })
          .catch((renderError) => {
            const errorMsg =
              renderError instanceof Error
                ? renderError.message
                : 'Failed to render document';
            setErrorMessage?.(
              `Render error: ${errorMsg}. Ensure the file is a valid .docx file (not .doc).`
            );
            setIsLoading?.(false);
            onLoadError?.();
          });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setErrorMessage?.(`Error processing document: ${errorMsg}`);
        setIsLoading?.(false);
        onLoadError?.();
      }
    }
  }, [base64Data, maxFileSizeMB]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}
      role="document"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {/* Document Viewer - Always render so ref is available */}
      <div
        ref={viewerRef}
        style={{
          padding: '1rem',
          transform: `scale(${scale}) translateX(${translateX}px)`,
          transformOrigin: 'top left',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          visibility: isLoading || errorMessage || !base64Data ? 'hidden' : 'visible',
        }}
      />

      {/* Empty State Overlay */}
      {!base64Data && !errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '14px',
            backgroundColor,
            zIndex: 10,
          }}
          role="status"
          aria-label="No document loaded"
        >
          No document to display
        </div>
      )}

      {/* Loading State Overlay */}
      {showLoadingState && isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '14px',
            backgroundColor,
            zIndex: 10,
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading document"
        >
          Loading document...
        </div>
      )}

      {/* Error State Overlay */}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor,
            zIndex: 10,
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              color: '#d32f2f',
              backgroundColor: '#ffebee',
              padding: '1rem',
              fontSize: '14px',
              border: '1px solid #ef5350',
              borderRadius: '4px',
              margin: '1rem',
            }}
          >
            <strong>Error:</strong> {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocViewer;
