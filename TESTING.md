# Testing Documentation

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for unit and integration testing.

## Test Structure

```
src/tests/
├── setup.js                    # Test setup and configuration
├── App.test.jsx                # App integration tests
├── api.test.js                 # API service tests
├── LoadingSpinner.test.jsx     # LoadingSpinner component tests
├── SensorStatusCard.test.jsx   # SensorStatusCard component tests
├── SystemStatus.test.jsx       # SystemStatus component tests
└── Login.test.jsx              # Login page tests
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Coverage

Current test suite includes:

- **Component Tests**: LoadingSpinner, SensorStatusCard, SystemStatus
- **Page Tests**: Login
- **Service Tests**: API authentication and configuration
- **Integration Tests**: App routing and context providers

### Test Statistics
- **Total Test Files**: 6
- **Total Tests**: 38
- **All Passing**: ✅

## Writing New Tests

### Component Test Example

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing Components with React Query

```jsx
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithQueryClient = (component) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};
```

### Mocking API Calls

```jsx
import { vi } from 'vitest';
import { brewnodeAPI } from '../services/brewnode';

vi.mock('../services/brewnode', () => ({
  brewnodeAPI: {
    getSensorStatus: vi.fn(),
    getSystemStatus: vi.fn(),
  },
}));

// In your test
brewnodeAPI.getSensorStatus.mockResolvedValue({ data: {} });
```

## Best Practices

1. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
2. **User-Centric**: Test from the user's perspective using Testing Library queries
3. **Isolation**: Mock external dependencies and API calls
4. **Descriptive Names**: Use clear, descriptive test names
5. **Clean Up**: Tests automatically clean up after each run

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Push to main branch
- Before deployment

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "act" warnings
- **Solution**: Wrap state updates in `waitFor` or use `screen.findBy*` queries

**Issue**: Cannot find element
- **Solution**: Use `screen.debug()` to see the rendered output

**Issue**: Async test timeouts
- **Solution**: Increase timeout or check for missing `await` statements

## Dependencies

- `vitest` - Test framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for Node.js
