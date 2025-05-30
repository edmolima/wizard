import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Layout } from './Layout';

// Mock useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

const mockUseLocation = vi.mocked(useLocation);

const createMockLocation = (pathname: string) => ({
  pathname,
  search: '',
  hash: '',
  state: null,
  key: 'default',
});

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with application title', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/loan-application/step1'));
    renderWithRouter(<Layout>Content</Layout>, {
      route: '/loan-application/step1',
    });
    expect(screen.getByText(/loan application/i)).toBeInTheDocument();
  });

  it('shows current step number in header', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/loan-application/step3'));
    renderWithRouter(<Layout>Content</Layout>, {
      route: '/loan-application/step3',
    });

    const stepIndicator = screen.getByText((content, element) => {
      if (!element) return false;
      const isSpan = element.tagName.toLowerCase() === 'span';
      const hasClass = element.className.includes('bg-blue-50');
      const hasText = element.textContent?.includes('Step 3 of 5') ?? false;
      return isSpan && hasClass && hasText;
    });

    expect(stepIndicator).toBeInTheDocument();
  });

  it('renders main content with proper ARIA attributes', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/loan-application/step2'));
    renderWithRouter(<Layout>Main Content</Layout>, {
      route: '/loan-application/step2',
    });

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-label', 'Step 2 content');
  });

  it('renders footer with security message', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/loan-application/step1'));
    renderWithRouter(<Layout>Content</Layout>, {
      route: '/loan-application/step1',
    });

    expect(screen.getByText('Your information is secure and encrypted')).toBeInTheDocument();
  });

  it('defaults to step 1 when path is not found', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/invalid-path'));
    renderWithRouter(<Layout>Content</Layout>, { route: '/invalid-path' });

    const stepIndicator = screen.getByText((content, element) => {
      if (!element) return false;
      const isSpan = element.tagName.toLowerCase() === 'span';
      const hasClass = element.className.includes('bg-blue-50');
      const hasText = element.textContent?.includes('Step 1 of 5') ?? false;
      return isSpan && hasClass && hasText;
    });

    expect(stepIndicator).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Step 1 content');
  });

  it('includes visually hidden description in header', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/loan-application/step1'));
    renderWithRouter(<Layout>Content</Layout>, {
      route: '/loan-application/step1',
    });

    expect(screen.getByText('- Multi-step form application process')).toBeInTheDocument();
  });

  it('applies proper styling classes', () => {
    mockUseLocation.mockReturnValue(createMockLocation('/loan-application/step1'));
    renderWithRouter(<Layout>Content</Layout>, {
      route: '/loan-application/step1',
    });

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'sticky',
      'top-0',
      'z-50',
      'w-full',
      'border-b',
      'border-gray-200',
      'bg-white/80',
      'backdrop-blur-sm'
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass(
      'relative',
      'rounded-xl',
      'border',
      'border-gray-200',
      'bg-white',
      'p-6',
      'sm:p-8',
      'shadow-sm',
      'ring-1',
      'ring-gray-900/5'
    );
  });
});
