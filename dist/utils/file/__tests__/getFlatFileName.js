"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getFlatFileNames', () => {
    const rndStr = () => (Math.random() + 0.5).toString().replace('.', '');
    test('Should flatten path', () => {
        const src = rndStr();
        const result = (0, __1.getFlatFileName)(src);
        expect(result).toBe(src);
        expect((0, __1.getFileExtension)(result)).toBe((0, __1.getFileExtension)(src));
    });
    test('Should flatten and hash path', () => {
        const src = `${rndStr()}.${rndStr()}`;
        const result = (0, __1.getFlatFileName)(src, { hash: true });
        expect(typeof result).toBe('string');
        const [name, ext] = result.split('.');
        expect(name.length).toBe(32);
        expect(`.${ext}`).toBe((0, __1.getFileExtension)(src));
    });
    test('Should flatten long path', () => {
        const srcSingle = rndStr();
        const src = [
            srcSingle,
            `${rndStr()}-${rndStr()}`,
            `${rndStr()}_${rndStr()}`,
            `${rndStr()} ${rndStr()}`,
            `${rndStr()}.${rndStr()}`,
            `${rndStr()}-${rndStr()} ${rndStr()}_${rndStr()}.${rndStr()}`,
            `${rndStr()}.${rndStr()}`,
        ].join('/');
        const result = (0, __1.getFlatFileName)(src);
        const resultSingle = (0, __1.getFlatFileName)(srcSingle);
        expect(resultSingle).toBe(srcSingle);
        expect(/[\\/]/.test(resultSingle)).toBe(false);
        expect(/[\\/]/.test(result)).toBe(false);
        expect((0, __1.getFileExtension)(result)).toBe((0, __1.getFileExtension)(src));
        expect(result.split(/[^a-z0-9]/).sort())
            .toEqual(src.split(/[^a-z0-9]/).sort());
    });
    test('Should have the same target', () => {
        const src = (0, __1.stdPath)(rndStr());
        const srcRun = (0, __1.stdPath)(src, rndStr(), '..', '.', '..', src);
        expect((0, __1.getFlatFileName)(src)).toBe((0, __1.getFlatFileName)(srcRun));
        expect((0, __1.getFlatFileName)(src, { hash: true }))
            .toBe((0, __1.getFlatFileName)(srcRun, { hash: true }));
    });
    test('Should have the same name with different extensions', () => {
        const ext = rndStr();
        expect((0, __1.getFileExtension)((0, __1.getFlatFileName)(`${rndStr()}${ext}`)))
            .toBe((0, __1.getFileExtension)((0, __1.getFlatFileName)(`${rndStr()}${ext}`)));
    });
});
//# sourceMappingURL=getFlatFileName.js.map