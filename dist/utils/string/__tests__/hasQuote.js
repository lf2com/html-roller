"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('hasQuote', () => {
    const rndStr = () => Math.random().toString();
    test('Should return true for string wrapped with \', ", or `', () => {
        [
            `'${rndStr()}'`,
            `"${rndStr()}"`,
            `\`${rndStr()}\``,
            `'${rndStr()}"${rndStr()}'`,
            `'${rndStr()}\`${rndStr()}'`,
            `"${rndStr()}'${rndStr()}"`,
            `"${rndStr()}\`${rndStr()}"`,
            `\`${rndStr()}'${rndStr()}\``,
            `\`${rndStr()}"${rndStr()}\``,
        ].forEach((str) => {
            expect((0, __1.hasQuote)(str)).toBe(true);
        });
    });
    test('Should return false for invalid strings', () => {
        [
            rndStr(),
            `'${rndStr()}"`,
            `'${rndStr()}\``,
            `"${rndStr()}'`,
            `"${rndStr()}\``,
            `\`${rndStr()}'`,
            `\`${rndStr()}"`,
            `${rndStr()}'${rndStr()}`,
            `${rndStr()}"${rndStr()}`,
            `${rndStr()}\`${rndStr()}`,
            `'${rndStr()}'${rndStr()}'`,
            `"${rndStr()}"${rndStr()}"`,
            `\`${rndStr()}\`${rndStr()}\``,
        ].forEach((str) => {
            expect((0, __1.hasQuote)(str)).toBe(false);
        });
    });
});
//# sourceMappingURL=hasQuote.js.map