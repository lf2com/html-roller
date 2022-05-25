import { printError } from '..';

describe('printError', () => {
  const rndStr = () => Math.random().toString();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should print error log', () => {
    const msg = rndStr();
    const logger = jest.spyOn(process.stderr, 'write');

    printError(msg);
    expect(logger).toBeCalledTimes(1);
    expect(logger).toBeCalledWith(`${msg}\n`);
  });
});
