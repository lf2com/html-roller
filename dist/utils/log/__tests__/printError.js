"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('printError', () => {
    const rndStr = () => Math.random().toString();
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('Should print error log', () => {
        const msg = rndStr();
        const logger = jest.spyOn(process.stderr, 'write');
        (0, __1.printError)(msg);
        expect(logger).toBeCalledTimes(1);
        expect(logger).toBeCalledWith(`${msg}\n`);
    });
});
//# sourceMappingURL=printError.js.map