"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('isLocalPath', () => {
    const rndStr = () => Math.random().toString();
    test('Should work for local paths', () => {
        expect((0, __1.isLocalPath)(__filename)).toBe(true);
        expect((0, __1.isLocalPath)(__dirname)).toBe(true);
        expect((0, __1.isLocalPath)(rndStr())).toBe(false);
    });
    test('Should work for non-local paths', () => {
        expect((0, __1.isLocalPath)(`http://${rndStr()}`)).toBe(false);
    });
});
//# sourceMappingURL=isLocalPath.js.map