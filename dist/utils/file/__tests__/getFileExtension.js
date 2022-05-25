"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getFileExtension', () => {
    const getExt = (src) => `.${src.split('.').pop()}`;
    test('Should return file extension', () => {
        const src = __filename;
        const target = getExt(src);
        expect((0, __1.getFileExtension)(src)).toBe(target);
    });
    test('Should return empty string on path without extension', () => {
        const src = __filename
            .split('.')
            .slice(0, -1)
            .join('.');
        expect((0, __1.getFileExtension)(src)).toBe('');
        expect((0, __1.getFileExtension)(__dirname)).toBe('');
    });
    test('Should be able to switch case', () => {
        const src = __filename.toUpperCase();
        const target = getExt(src);
        const targetLowerCase = target === null || target === void 0 ? void 0 : target.toLowerCase();
        expect((0, __1.getFileExtension)(src)).toBe(targetLowerCase);
        expect((0, __1.getFileExtension)(src, { keepCase: true })).toBe(target);
        expect((0, __1.getFileExtension)(src, { keepCase: false })).toBe(targetLowerCase);
    });
});
//# sourceMappingURL=getFileExtension.js.map