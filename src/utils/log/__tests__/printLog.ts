import { printLog } from '..';

describe('printLog', () => {
  const rndStr = () => Math.random().toString();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should print log', () => {
    const msg = rndStr();
    const logger = jest.spyOn(process.stdout, 'write');

    printLog(msg);
    expect(logger).toBeCalledTimes(1);
    expect(logger).toBeCalledWith(`${msg}\n`);
  });
});
