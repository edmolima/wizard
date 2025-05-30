import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children content', () => {
    render(<VisuallyHidden>Test Content</VisuallyHidden>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies visually hidden styles', () => {
    render(<VisuallyHidden>Content</VisuallyHidden>);
    const element = screen.getByText('Content');

    expect(element).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
  });

  it('merges custom styles with visually hidden styles', () => {
    render(<VisuallyHidden style={{ backgroundColor: 'rgb(255, 0, 0)' }}>Content</VisuallyHidden>);

    const element = screen.getByText('Content');
    const styles = window.getComputedStyle(element);
    expect(styles.position).toBe('absolute');
    expect(styles.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('forwards additional props to the span element', () => {
    render(
      <VisuallyHidden data-testid="test" aria-label="Test Label">
        Content
      </VisuallyHidden>
    );

    const element = screen.getByTestId('test');
    expect(element).toHaveAttribute('aria-label', 'Test Label');
  });
});
