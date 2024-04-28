const aux = () => {
  Object.defineProperty(window, 'localStorage', {value: localStorageMock()});
}

const localStorageMock = (() => {
  let store = {user: JSON.stringify({
      token: "testToken",
      userId: "testId",
      username: "testUser"
    })};
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

module.exports = aux;