"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getDir', () => {
    test('Should get the right directory of file', () => {
        const src = __filename;
        const target = (0, __1.stdPath)(__filename, '..');
        expect((0, __1.getDir)(src)).toBe(target);
    });
    test('Should get the right directory of folder', () => {
        const src = __dirname;
        const target = (0, __1.stdPath)(src, '..');
        expect((0, __1.getDir)(src)).toBe(target);
    });
    test('Should handle . and ..', () => {
        const src = `${__filename}/../.`;
        const target = (0, __1.stdPath)(__dirname);
        expect((0, __1.getDir)(src)).toBe(target);
    });
});
//# sourceMappingURL=getDir.js.map