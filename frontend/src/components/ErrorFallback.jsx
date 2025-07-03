import React from 'react';
import Button from './ui/Button';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 mb-4 max-w-md mx-auto">
      {error.message}
    </pre>
    <Button variant="outline" onClick={resetErrorBoundary}>
      Retry
    </Button>
  </div>
);

export default ErrorFallback;
