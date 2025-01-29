// Mock localStorage implementation
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

export const setupLocalStorageMock = () => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });
};

export const clearLocalStorage = () => {
  window.localStorage.clear();
};

export const setLocalStorageItem = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = (key: string) => {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
