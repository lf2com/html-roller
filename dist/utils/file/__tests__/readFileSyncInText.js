"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const __1 = require("..");
describe('readFileSyncInText', () => {
    test('Should return text of file', () => {
        const src = __filename;
        const result = (0, __1.readFileSyncInText)(src);
        expect(typeof result).toBe('string');
        expect(result).toBe(fs_1.default.readFileSync(src, { encoding: 'utf8' }));
    });
    test('Should throw error if file not found', () => {
        expect(() => (0, __1.readFileSyncInText)('')).toThrowError();
    });
});
//# sourceMappingURL=readFileSyncInText.js.map