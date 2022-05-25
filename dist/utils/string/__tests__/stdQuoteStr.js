"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('stdQuoteStr', () => {
    const rndStr = () => Math.random().toString();
    test('Should unwrap quoted strings', () => {
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
            expect((0, __1.stdQuoteStr)(str)).toBe(str.slice(1, -1));
        });
    });
    test('Should keep the original strings', () => {
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
            expect((0, __1.stdQuoteStr)(str)).toBe(str);
        });
    });
});
//# sourceMappingURL=stdQuoteStr.js.map