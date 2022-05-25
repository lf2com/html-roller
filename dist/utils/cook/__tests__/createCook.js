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
describe('createCook', () => {
    const rndStr = () => Math.random().toString();
    test('Should return cook', () => {
        const cook = (0, __1.createCook)();
        const str = rndStr();
        expect(typeof cook).toBe('function');
        expect(cook(str)).resolves.toBe(str);
    });
    test('Should work with recipes', () => __awaiter(void 0, void 0, void 0, function* () {
        const str = rndStr();
        const options = {
            [rndStr()]: rndStr(),
            [rndStr()]: rndStr(),
            [rndStr()]: rndStr(),
        };
        const recipe = (src, raw, opt) => __awaiter(void 0, void 0, void 0, function* () {
            expect(raw).toBe(str);
            expect(opt).toStrictEqual(options);
            return src.replace(/(\d)(\d)(\d)/g, '$2$3$1');
        });
        const cook = (0, __1.createCook)(recipe);
        const cnv = yield recipe(str, str, options);
        const cookTwice = (0, __1.createCook)([
            recipe,
            ((src, ...args) => {
                expect(src).toBe(cnv);
                return recipe(src, ...args);
            }),
        ]);
        const cnvTwice = yield recipe(yield recipe(str, str, options), str, options);
        expect(cook(str, options)).resolves.toBe(cnv);
        expect(cookTwice(str, options)).resolves.toBe(cnvTwice);
    }));
});
//# sourceMappingURL=createCook.js.map