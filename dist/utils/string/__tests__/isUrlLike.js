"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('isUrlLike', () => {
    const rndStr = () => Math.random().toString();
    const protocols = [
        'http://', 'https://', 'file:///', 'ws://', 'wss://',
    ];
    test('Should return true for valid URLs', () => {
        const path = rndStr();
        protocols.forEach((protocol) => {
            const url = `${protocol}${path}`;
            const port = rndStr().slice(-5);
            const qs = `?${rndStr()}`;
            const hash = `#${rndStr()}`;
            expect((0, __1.isUrlLike)(protocol)).toBe(true);
            expect((0, __1.isUrlLike)(url)).toBe(true);
            expect((0, __1.isUrlLike)(hash)).toBe(true);
            expect((0, __1.isUrlLike)(`${url}:${port}`)).toBe(true);
            expect((0, __1.isUrlLike)(`${url}:${port}${qs}`)).toBe(true);
            expect((0, __1.isUrlLike)(`${url}:${port}${hash}`)).toBe(true);
            expect((0, __1.isUrlLike)(`${url}:${port}${qs}${hash}`)).toBe(true);
            expect((0, __1.isUrlLike)(`${protocol.toUpperCase()}${path}`)).toBe(true);
        });
    });
    test('Should return false for invalid URLs', () => {
        const path = rndStr();
        expect((0, __1.isUrlLike)('')).toBe(false);
        expect((0, __1.isUrlLike)(path)).toBe(false);
        expect((0, __1.isUrlLike)(`?${path}`)).toBe(false);
        expect((0, __1.isUrlLike)(`http${path}`)).toBe(false);
        expect((0, __1.isUrlLike)(`htp://${path}`)).toBe(false);
        expect((0, __1.isUrlLike)(`http:/${path}`)).toBe(false);
    });
});
//# sourceMappingURL=isUrlLike.js.map