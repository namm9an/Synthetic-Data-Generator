import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      
      console.error('Uncaught error:', error, info);
    }}
  >
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;
