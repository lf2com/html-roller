"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getFileName', () => {
    const getName = (src) => src.split(/[\\/]/).pop();
    test('Should get the right file name', () => {
        const src = __filename;
        const target = getName(src);
        expect((0, __1.getFileName)(src)).toBe(target);
    });
    test('Should get the right folder name', () => {
        const src = __dirname;
        const target = getName(src);
        expect((0, __1.getFileName)(src)).toBe(target);
    });
    test('Should handle . and ..', () => {
        const src = `${__filename}/../.`;
        const target = getName(__dirname);
        expect((0, __1.getFileName)(src)).toBe(target);
    });
});
//# sourceMappingURL=getFileName.js.map