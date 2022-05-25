"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('replaceStrAsync', () => {
    const rndStr = () => Math.random().toString();
    test('Should work with string/string', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = rndStr();
        const search = '.';
        const replacer = rndStr();
        const result = yield (0, __1.replaceStrAsync)(src, search, replacer);
        expect(typeof result).toBe('string');
        expect(result).toBe(src.replace(search, replacer));
    }));
    test('Should work with regex/string', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = rndStr();
        const search = /(.)(.)/g;
        const replacer = '$2$1';
        const result = yield (0, __1.replaceStrAsync)(src, search, replacer);
        expect(typeof result).toBe('string');
        expect(result).toBe(src.replace(search, replacer));
    }));
    test('Should work with string/function', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = rndStr();
        const val = rndStr();
        const search = '.';
        const replacer = () => val;
        const result = yield (0, __1.replaceStrAsync)(src, search, replacer);
        expect(typeof result).toBe('string');
        expect(result).toBe(src.replace(search, replacer));
    }));
    test('Shoule work with regex/function', () => __awaiter(void 0, void 0, void 0, function* () {
        const src = rndStr();
        const search = /(.)(.)/g;
        const replacer = (_, a1, a2) => `${a2}${a1}`;
        const result = yield (0, __1.replaceStrAsync)(src, search, replacer);
        expect(typeof result).toBe('string');
        expect(result).toBe(src.replace(search, replacer));
    }));
});
//# sourceMappingURL=replaceStrAsync.js.map