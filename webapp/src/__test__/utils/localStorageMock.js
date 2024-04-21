const localStorageMock = (() => {
  let store = {};
  Object.defineProperty(window, 'localStorage', {value: localStorageMock});
  return {
    getItem: key => store[key],
    setItem: (key, value) => {
      store[key] = value
    },
    removeItem: key => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  };
});

module.exports = localStorageMock;