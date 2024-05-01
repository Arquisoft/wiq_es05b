import reportWebVitals from '../../scripts/reportWebVitals';

jest.mock('web-vitals', () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe('reportWebVitals', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('no hace nada si onPerfEntry no se proporciona', async () => {
    const mockImport = jest.spyOn(import('web-vitals'), 'then');
    await reportWebVitals();
    expect(mockImport).not.toHaveBeenCalled();
  });

  test('no hace nada si onPerfEntry no es una función', async () => {
    const mockImport = jest.spyOn(import('web-vitals'), 'then');
    await reportWebVitals({});
    expect(mockImport).not.toHaveBeenCalled();
  });

  test('no hace nada si onPerfEntry no es una función', async () => {
    const mockImport = jest.spyOn(import('web-vitals'), 'then');
    await reportWebVitals(function () {});
  });
});