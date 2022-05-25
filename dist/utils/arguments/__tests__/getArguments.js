"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getArguments', () => {
    const rndStr = () => new Array(5)
        .fill(0)
        .map(() => (String.fromCharCode(Math.floor(97 + 26 * Math.random()))))
        .join('');
    const list = new Array(3)
        .fill(0)
        .reduce((params) => (Object.assign(Object.assign({}, params), { [rndStr()]: rndStr() })), {});
    const fullKeys = Object.keys(list);
    test('Should return argv and args', () => {
        const resultEmpty = (0, __1.getArguments)();
        const resultNoInput = (0, __1.getArguments)({
            inputArgv: [],
        });
        expect(Array.isArray(resultEmpty.argv)).toBe(true);
        expect(typeof resultEmpty.args).toBe('object');
        expect(resultNoInput.argv.length).toBe(0);
        expect(resultNoInput.args).toStrictEqual({});
    });
    test('Should return args', () => {
        fullKeys.forEach((fullKey) => {
            const val = rndStr();
            const shortKey = list[fullKey];
            const resultFull = (0, __1.getArguments)({
                argList: list,
                inputArgv: [`--${fullKey}`, val],
            });
            const resultShort = (0, __1.getArguments)({
                argList: list,
                inputArgv: [`-${shortKey}`, val],
            });
            expect(resultFull.argv.length).toBe(0);
            expect(Object.keys(resultFull.args).length).toBe(1);
            expect(resultFull.args[fullKey]).toBe(val);
            expect(resultShort.argv.length).toBe(0);
            expect(Object.keys(resultShort.args).length).toBe(1);
            expect(resultShort.args[fullKey]).toBe(val);
        });
    });
    test('Should return argv', () => {
        [
            [rndStr(), rndStr(), rndStr()],
            [`-${rndStr()}`, `--${rndStr()}`],
            [`---${rndStr()}`, `-${rndStr()}-`, `--${rndStr()}-`],
        ].forEach((input) => {
            const result = (0, __1.getArguments)({ inputArgv: input });
            expect(result.argv).toEqual(input);
        });
    });
    test('Should keep args of the list', () => {
        const values = fullKeys.reduce((params, fullKey) => (Object.assign(Object.assign({}, params), { [fullKey]: rndStr() })), {});
        const inputFull = fullKeys
            .map((fullKey) => [
            `--${fullKey}`,
            values[fullKey],
        ])
            .flat();
        const inputShort = fullKeys
            .map((fullKey) => [
            `-${list[fullKey]}`,
            values[fullKey],
        ])
            .flat();
        const resultFull = (0, __1.getArguments)({
            argList: list,
            inputArgv: inputFull,
        });
        const resultShort = (0, __1.getArguments)({
            argList: list,
            inputArgv: inputShort,
        });
        expect(resultFull.args).toStrictEqual(values);
        expect(resultShort.args).toStrictEqual(values);
    });
    test('Should auto assign true for arguments without values', () => {
        const values = fullKeys.reduce((params, fullKey) => (Object.assign(Object.assign({}, params), { [fullKey]: true })), {});
        const inputFull = fullKeys
            .map((fullKey) => `--${fullKey}`)
            .flat();
        const inputShort = fullKeys
            .map((fullKey) => `-${list[fullKey]}`)
            .flat();
        const resultFull = (0, __1.getArguments)({
            argList: list,
            inputArgv: inputFull,
        });
        const resultShort = (0, __1.getArguments)({
            argList: list,
            inputArgv: inputShort,
        });
        expect(resultFull.args).toStrictEqual(values);
        expect(resultShort.args).toStrictEqual(values);
    });
    test('Should throw error for unknown arguments', () => {
        expect(() => (0, __1.getArguments)({
            inputArgv: [`--${rndStr()}`],
            argList: list,
            throwUnsupports: true,
        })).toThrowError();
    });
});
//# sourceMappingURL=getArguments.js.map