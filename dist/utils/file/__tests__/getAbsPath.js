"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getAbsPath', () => {
    const rndNum = (l = 0, u = l + 9) => Math.floor(l + (u - l) * Math.random());
    const getStrs = (f, n = 1) => new Array(n)
        .fill(0)
        .map(() => f());
    const repeatStr = (f, n = 1, s = '') => getStrs(f, n).join(s);
    const rndChar = (n = 1) => repeatStr(() => (String.fromCharCode(Math.floor(97 + 26 * Math.random()))), n);
    const base = rndChar(5);
    const subpaths = getStrs(() => rndChar(rndNum(5, 10)), 3);
    const subpath = subpaths.join('/');
    test('Should return absolute path of source', () => {
        const file = (0, __1.stdPath)(__filename);
        const filename = (0, __1.getFileName)(file);
        const dir = (0, __1.stdPath)(__dirname);
        const dirname = (0, __1.getFileName)(dir);
        expect((0, __1.getAbsPath)(file)).toBe(file);
        expect((0, __1.getAbsPath)(dir)).toBe(dir);
        expect((0, __1.getAbsPath)((0, __1.stdPath)('.', (0, __1.getFileName)(file)))).toBe(filename);
        expect((0, __1.getAbsPath)((0, __1.stdPath)('.', (0, __1.getFileName)(dir)))).toBe(dirname);
        expect((0, __1.getAbsPath)((0, __1.stdPath)('./..', (0, __1.getFileName)(dir)))).toBe(`../${dirname}`);
    });
    test('Should return the same paths', () => {
        [
            `/${rndChar()}/${subpath}`,
            `${rndChar()}:/${subpath}`,
            `/${subpath}`,
        ].forEach((str) => {
            expect((0, __1.getAbsPath)(str, base)).toBe((0, __1.stdPath)(str));
        });
    });
    test('Should convert relative paths', () => {
        [
            subpath,
            `./${subpath}`,
            `../${subpath}`,
            `./../${subpath}`,
            `${rndChar(5)}/../${rndChar(5)}/../${subpath}`,
        ].forEach((str) => {
            expect((0, __1.getAbsPath)(str, base)).toBe((0, __1.stdPath)(base, str));
        });
    });
});
//# sourceMappingURL=getAbsPath.js.map