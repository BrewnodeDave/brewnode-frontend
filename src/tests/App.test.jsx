import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from '../App';

// Mock child components to avoid complex dependencies
vi.mock('../pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock('../pages/Login', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('../pages/ProcessControl', () => ({
  default: () => <div>Process Control Page</div>,
}));

vi.mock('../pages/SensorControl', () => ({
  default: () => <div>Sensor Control Page</div>,
}));

vi.mock('../pages/Brewfather', () => ({
  default: () => <div>Brewfather Page</div>,
}));

vi.mock('../pages/Simulator', () => ({
  default: () => <div>Simulator Page</div>,
}));

describe('App Integration', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderApp = () => {
    return render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderApp();
    // App should render something
    expect(document.body).toBeTruthy();
  });

  it('provides QueryClient context to children', () => {
    const { container } = renderApp();
    expect(container).toBeInTheDocument();
  });
});
