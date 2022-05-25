"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getQuote', () => {
    const rndStr = () => Math.random().toString();
    test('Should return quote of valid strings', () => {
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
            expect((0, __1.getQuote)(str)).toBe(str[0]);
        });
    });
    test('Should return empty string of invalid strings', () => {
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
            expect((0, __1.getQuote)(str)).toBe('');
        });
    });
});
//# sourceMappingURL=getQuote.js.map