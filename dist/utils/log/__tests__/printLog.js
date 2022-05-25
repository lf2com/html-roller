"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('printLog', () => {
    const rndStr = () => Math.random().toString();
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('Should print log', () => {
        const msg = rndStr();
        const logger = jest.spyOn(process.stdout, 'write');
        (0, __1.printLog)(msg);
        expect(logger).toBeCalledTimes(1);
        expect(logger).toBeCalledWith(`${msg}\n`);
    });
});
//# sourceMappingURL=printLog.js.map