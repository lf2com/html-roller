"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getUrlWithoutExt', () => {
    const rndStr = () => Math.random().toString();
    test('Should return URL without query string', () => {
        const str = rndStr();
        const qs = `?${rndStr()}`;
        const hash = `#${rndStr()}`;
        expect((0, __1.getUrlWithoutExt)('')).toBe('');
        expect((0, __1.getUrlWithoutExt)(str)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${qs}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${qs}=${rndStr()}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${qs}&${rndStr()}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${qs}&${rndStr()}=${rndStr()}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${hash}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${hash}=${rndStr()}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${hash}&${rndStr()}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${hash}&${rndStr()}=${rndStr()}`)).toBe(str);
        expect((0, __1.getUrlWithoutExt)(`${str}${qs}${hash}`)).toBe(str);
    });
});
//# sourceMappingURL=getUrlWithoutExt.js.map