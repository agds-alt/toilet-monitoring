import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc';

/**
 * Custom render function that includes all providers
 */
function AllProviders({ children }: { children: ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}

/**
 * Custom render with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
