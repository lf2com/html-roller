"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const __1 = require("..");
describe('stdPath', () => {
    const convSlash = (src) => src.replace(/\\/g, '/');
    test('Should convert \\ to /', () => {
        const src = __filename;
        expect((0, __1.stdPath)(src)).toBe(convSlash(src));
    });
    test('Should point to the same path', () => {
        const src = __filename;
        expect(fs_1.default.readFileSync((0, __1.stdPath)(src)))
            .toStrictEqual(fs_1.default.readFileSync(src));
    });
    test('Should end with / in case of folder', () => {
        expect((0, __1.stdPath)(__dirname)).toBe(convSlash(`${__dirname}/`));
        expect((0, __1.stdPath)(`${__dirname}/`)).toBe(convSlash(`${__dirname}/`));
        expect((0, __1.stdPath)(`${__filename}/`)).toBe(convSlash(`${__filename}/`));
    });
    test('Should handle . and ..', () => {
        const src = `${__filename}/../.`;
        expect((0, __1.stdPath)(src)).toBe(convSlash(`${__dirname}/`));
    });
    test('Should support multiple arguments', () => {
        const src = __filename.split(/[\\/]/);
        expect((0, __1.stdPath)(...src)).toBe(convSlash(__filename));
    });
});
//# sourceMappingURL=stdPath.js.map