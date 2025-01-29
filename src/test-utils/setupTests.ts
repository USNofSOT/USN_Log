import { setupLocalStorageMock, clearLocalStorage } from "./localStorage-utils";

// Setup before all tests
beforeAll(() => {
  // Setup localStorage mock
  setupLocalStorageMock();
});

// Setup before each test
beforeEach(() => {
  // Clear localStorage before each test
  clearLocalStorage();
});

// Cleanup after each test
afterEach(() => {
  // Clear any mocks or side effects
  jest.clearAllMocks();
});
