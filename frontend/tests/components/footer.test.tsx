import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/footer';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';

// Simple component test to validate rendering and key links
describe('Footer', () => {
  it('renders brand and contact link', () => {
    render(<Footer />);
    expect(screen.getByText('sNDa')).toBeInTheDocument();
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', 'mailto:snda@hey.me');
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
  });
});
