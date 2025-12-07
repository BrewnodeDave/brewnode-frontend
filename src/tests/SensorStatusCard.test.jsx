import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Thermometer } from 'lucide-react';
import SensorStatusCard from '../components/SensorStatusCard';

describe('SensorStatusCard', () => {
  const defaultProps = {
    title: 'Temperature',
    icon: Thermometer,
    value: '25',
    unit: '°C',
    color: 'blue',
    loading: false,
  };

  it('renders with basic props', () => {
    render(<SensorStatusCard {...defaultProps} />);
    
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<SensorStatusCard {...defaultProps} loading={true} />);
    
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.queryByText('25')).not.toBeInTheDocument();
  });

  it('renders without unit when not provided', () => {
    render(<SensorStatusCard {...defaultProps} unit={undefined} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.queryByText('°C')).not.toBeInTheDocument();
  });

  it('shows status indicator when enabled and active', () => {
    render(
      <SensorStatusCard 
        {...defaultProps} 
        showStatusIndicator={true}
        isActive={true}
      />
    );
    
    expect(screen.getByText('ON')).toBeInTheDocument();
  });

  it('shows status indicator when enabled and inactive', () => {
    render(
      <SensorStatusCard 
        {...defaultProps} 
        showStatusIndicator={true}
        isActive={false}
      />
    );
    
    expect(screen.getByText('OFF')).toBeInTheDocument();
  });

  it('shows custom status text', () => {
    render(
      <SensorStatusCard 
        {...defaultProps} 
        showStatusIndicator={true}
        isActive={true}
        statusText="RUNNING"
      />
    );
    
    expect(screen.getByText('RUNNING')).toBeInTheDocument();
  });

  it('does not show status indicator by default', () => {
    render(<SensorStatusCard {...defaultProps} />);
    
    expect(screen.queryByText('ON')).not.toBeInTheDocument();
    expect(screen.queryByText('OFF')).not.toBeInTheDocument();
  });

  it('applies color classes correctly', () => {
    const { container } = render(<SensorStatusCard {...defaultProps} color="red" />);
    const coloredDiv = container.querySelector('.text-red-600');
    
    expect(coloredDiv).toBeInTheDocument();
  });

  it('applies default color when invalid color provided', () => {
    const { container } = render(<SensorStatusCard {...defaultProps} color="invalid" />);
    const coloredDiv = container.querySelector('.text-blue-600');
    
    expect(coloredDiv).toBeInTheDocument();
  });
});
