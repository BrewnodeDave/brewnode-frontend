import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders without text when text prop is empty', () => {
    render(<LoadingSpinner text="" />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies small size classes correctly', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    const spinner = container.querySelector('.w-8');
    expect(spinner).toBeInTheDocument();
  });

  it('applies medium size classes correctly', () => {
    const { container } = render(<LoadingSpinner size="medium" />);
    const spinner = container.querySelector('.w-16');
    expect(spinner).toBeInTheDocument();
  });

  it('applies large size classes correctly', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    const spinner = container.querySelector('.w-24');
    expect(spinner).toBeInTheDocument();
  });

  it('has animation classes', () => {
    const { container } = render(<LoadingSpinner />);
    const pulseElement = container.querySelector('.animate-pulse');
    const spinElement = container.querySelector('.animate-spin');
    
    expect(pulseElement).toBeInTheDocument();
    expect(spinElement).toBeInTheDocument();
  });
});
