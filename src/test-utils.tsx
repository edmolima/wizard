import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Helper function to render components with necessary providers
function customRender(ui: ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the default render with our custom version
export { customRender as render };
