import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import * as apiService from '../services/api';

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API service
vi.mock('../services/api', () => ({
  setAuth: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders login form', () => {
    renderLogin();

    expect(screen.getByText('Sign in to Brewnode')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the eye icon to show password
    const toggleButton = screen.getByRole('button', { name: '' });
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({ ok: true });

    renderLogin();

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'testpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(apiService.setAuth).toHaveBeenCalledWith('testuser', 'testpass');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles failed login', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({ ok: false });

    renderLogin();

    await user.type(screen.getByPlaceholderText(/username/i), 'wronguser');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
      expect(apiService.setAuth).toHaveBeenCalledWith(null, null);
    });
  });

  it('handles connection error', async () => {
    const user = userEvent.setup();
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderLogin();

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'testpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/connection error/i)).toBeInTheDocument();
      expect(apiService.setAuth).toHaveBeenCalledWith(null, null);
    });
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    global.fetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    renderLogin();

    await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/password/i), 'testpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Button should be disabled during loading
    const signInButton = screen.getByRole('button', { name: /signing in/i });
    expect(signInButton).toBeDisabled();

    // Resolve the promise
    resolvePromise({ ok: true });
  });

  it('disables form submission with empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(signInButton);

    // Should not call setAuth with empty credentials
    expect(apiService.setAuth).not.toHaveBeenCalled();
  });
});
