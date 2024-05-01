
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({ render: jest.fn() }))
}));

jest.mock('axios', () => ({
  defaults: {
    baseURL: ''
  }
}));

jest.mock('./scripts/reportWebVitals', () => jest.fn());

describe('reportWebVitals', () => {
  it('should call reportWebVitals', () => {
    jest.isolateModules(() => {
      const reportWebVitals = require('./scripts/reportWebVitals');
      require('./index');
      expect(reportWebVitals).toHaveBeenCalled();
    });
  });
});
