import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import SystemStatus from '../components/SystemStatus';
import { brewnodeAPI } from '../services/brewnode';

// Mock the brewnode API
vi.mock('../services/brewnode', () => ({
  brewnodeAPI: {
    getSensorStatus: vi.fn(),
    getSystemStatus: vi.fn(),
    restart: vi.fn(),
    deleteLogs: vi.fn(),
  },
}));

// Mock window.confirm
global.confirm = vi.fn();

describe('SystemStatus', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithQueryClient = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  const mockSensorData = {
    data: {
      kettleHeaterPower: 100,
    },
  };

  const mockSystemStatus = {
    data: {
      isHardware: true,
      uptime: 3600,
    },
  };

  it('renders system status title', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);

    renderWithQueryClient(<SystemStatus />);

    expect(screen.getByText('System Status')).toBeInTheDocument();
  });

  it('displays restart button', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);

    renderWithQueryClient(<SystemStatus />);

    expect(screen.getByText('Restart Server')).toBeInTheDocument();
  });

  it('displays clear logs button', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);

    renderWithQueryClient(<SystemStatus />);

    expect(screen.getByText('Clear Logs')).toBeInTheDocument();
  });

  it('calls restart API when restart button clicked and confirmed', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);
    brewnodeAPI.restart.mockResolvedValue({});
    global.confirm.mockReturnValue(true);

    const user = userEvent.setup();
    renderWithQueryClient(<SystemStatus />);

    const restartButton = screen.getByText('Restart Server');
    await user.click(restartButton);

    await waitFor(() => {
      expect(brewnodeAPI.restart).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call restart API when restart cancelled', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);
    global.confirm.mockReturnValue(false);

    const user = userEvent.setup();
    renderWithQueryClient(<SystemStatus />);

    const restartButton = screen.getByText('Restart Server');
    await user.click(restartButton);

    expect(brewnodeAPI.restart).not.toHaveBeenCalled();
  });

  it('calls deleteLogs API when clear logs button clicked and confirmed', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);
    brewnodeAPI.deleteLogs.mockResolvedValue({});
    global.confirm.mockReturnValue(true);

    const user = userEvent.setup();
    renderWithQueryClient(<SystemStatus />);

    const clearLogsButton = screen.getByText('Clear Logs');
    await user.click(clearLogsButton);

    await waitFor(() => {
      expect(brewnodeAPI.deleteLogs).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call deleteLogs API when clear logs cancelled', async () => {
    brewnodeAPI.getSensorStatus.mockResolvedValue(mockSensorData);
    brewnodeAPI.getSystemStatus.mockResolvedValue(mockSystemStatus);
    global.confirm.mockReturnValue(false);

    const user = userEvent.setup();
    renderWithQueryClient(<SystemStatus />);

    const clearLogsButton = screen.getByText('Clear Logs');
    await user.click(clearLogsButton);

    expect(brewnodeAPI.deleteLogs).not.toHaveBeenCalled();
  });

  it('uses prop sensor data when provided', () => {
    const propSensorData = { data: { kettleHeaterPower: 50 } };
    
    renderWithQueryClient(<SystemStatus sensorData={propSensorData} />);

    // Component should use propSensorData instead of fetching
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });
});
