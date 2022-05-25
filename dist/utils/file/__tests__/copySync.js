"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const __1 = require("..");
describe('copySync', () => {
    const rndStr = () => Math.random().toString();
    const tempDir = (0, __1.stdPath)(__dirname, `.tmp${rndStr()}`);
    const genFile = (filePath, content = rndStr()) => {
        fs_1.default.writeFileSync(filePath, content);
    };
    const doNode = (node, doStuff, rootPath = '') => {
        Object.keys(node).forEach((name) => {
            const key = name;
            const value = node[key];
            const currPath = (0, __1.stdPath)(rootPath, name);
            doStuff(currPath, value);
            if (typeof value !== 'string') {
                doNode(value, doStuff, currPath);
            }
        });
    };
    beforeEach(() => {
        fs_1.default.rmSync(tempDir, { recursive: true, force: true });
        fs_1.default.mkdirSync(tempDir);
    });
    afterEach(() => {
        fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    });
    test('Should copy file', () => {
        const src = (0, __1.stdPath)(tempDir, rndStr());
        const target = (0, __1.stdPath)(tempDir, rndStr());
        genFile(src);
        (0, __1.copySync)(src, target);
        expect(fs_1.default.readFileSync(target))
            .toStrictEqual(fs_1.default.readFileSync(src));
    });
    test('Should copy folder', () => {
        const srcDir = (0, __1.stdPath)(tempDir, rndStr());
        const targetDir = (0, __1.stdPath)(tempDir, rndStr());
        const tree = {
            [rndStr()]: rndStr(),
            [rndStr()]: rndStr(),
            [rndStr()]: {
                [rndStr()]: rndStr(),
                [rndStr()]: rndStr(),
                [rndStr()]: {},
                [rndStr()]: {
                    [rndStr()]: rndStr(),
                    [rndStr()]: rndStr(),
                    [rndStr()]: {},
                },
            },
        };
        const srcPaths = [];
        fs_1.default.mkdirSync(srcDir);
        doNode(tree, (currPath, value) => {
            if (typeof value === 'string') {
                genFile(currPath, value);
                srcPaths.push(currPath);
            }
            else {
                fs_1.default.mkdirSync(currPath);
            }
        }, srcDir);
        (0, __1.copySync)(srcDir, targetDir);
        doNode(tree, (currPath, value) => {
            const isDir = fs_1.default.statSync(currPath).isDirectory();
            expect(fs_1.default.existsSync(currPath)).toBe(true);
            expect(isDir).toBe(typeof value !== 'string');
            if (!isDir) {
                const content = fs_1.default.readFileSync(currPath, { encoding: 'utf8' });
                expect(content).toBe(value);
            }
        }, targetDir);
    });
    test('Should support overwrite option', () => {
        const src = (0, __1.stdPath)(tempDir, rndStr());
        const target = (0, __1.stdPath)(tempDir, rndStr());
        genFile(src);
        const rawContent = fs_1.default.readFileSync(src);
        (0, __1.copySync)(src, target);
        expect(fs_1.default.readFileSync(target)).toStrictEqual(rawContent);
        genFile(src);
        (0, __1.copySync)(src, target, { overwrite: false });
        expect(fs_1.default.readFileSync(target)).toStrictEqual(rawContent);
        (0, __1.copySync)(src, target, { overwrite: true });
        expect(fs_1.default.readFileSync(target)).toStrictEqual(fs_1.default.readFileSync(src));
        genFile(src);
        (0, __1.copySync)(src, target);
        expect(fs_1.default.readFileSync(target)).toStrictEqual(fs_1.default.readFileSync(src));
    });
    test('Should throw error for no source', () => {
        expect(() => {
            (0, __1.copySync)(`${__filename}${rndStr()}`, `${__filename}${rndStr()}`);
        }).toThrow(ReferenceError);
    });
    test('Should throw error for not matched source type and target type', () => {
        const dir = (0, __1.stdPath)(tempDir, rndStr());
        const file = (0, __1.stdPath)(tempDir, rndStr());
        fs_1.default.mkdirSync(dir);
        genFile(file);
        expect(() => (0, __1.copySync)(dir, file)).toThrowError();
        expect(() => (0, __1.copySync)(file, dir)).toThrowError();
    });
});
//# sourceMappingURL=copySync.js.map