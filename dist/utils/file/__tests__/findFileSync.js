"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const __1 = require("..");
describe('findFileSync', () => {
    const rndStr = () => Math.random().toString();
    const rndPick = (a) => a[Math.floor(Math.random() * a.length)];
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
    const treeNodes = [];
    fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    fs_1.default.mkdirSync(tempDir);
    doNode(tree, (currPath, value) => {
        if (typeof value === 'string') {
            genFile(currPath, value);
        }
        else {
            fs_1.default.mkdirSync(currPath);
        }
    }, tempDir);
    doNode(tree, (currPath, value) => {
        treeNodes.push({
            path: currPath,
            isDir: typeof value !== 'string',
        });
    }, tempDir);
    afterAll(() => {
        fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    });
    test('Should find file in path', () => {
        const result = (0, __1.findFilesSync)(tempDir).sort();
        const targets = treeNodes
            .filter((node) => !node.isDir)
            .map((node) => node.path)
            .sort();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toStrictEqual(targets);
    });
    test('Should support filter of string', () => {
        const candidates = treeNodes.filter((node) => !node.isDir);
        const target = rndPick(candidates).path;
        const filter = target;
        const result = (0, __1.findFilesSync)(tempDir, { filter });
        expect(result.length).toBe(1);
        expect(result[0]).toBe(target);
    });
    test('Should support filter of regular expression', () => {
        const candidates = treeNodes.filter((node) => !node.isDir);
        const target = rndPick(candidates).path;
        const filterFull = new RegExp(target);
        const resultFull = (0, __1.findFilesSync)(tempDir, { filter: filterFull });
        const filterPartial = new RegExp(`${(0, __1.getFileName)(target)}$`);
        const resultPartial = (0, __1.findFilesSync)(tempDir, { filter: filterPartial });
        expect(resultFull.length).toBe(1);
        expect(resultFull[0]).toBe(target);
        expect(resultPartial.length).toBe(1);
        expect(resultPartial[0]).toBe(target);
    });
    test('Should supprt filter of function', () => {
        const candidates = treeNodes.filter((node) => !node.isDir);
        const target = rndPick(candidates).path;
        const filterFound = (filePath) => filePath.includes(target);
        const resultFound = (0, __1.findFilesSync)(tempDir, { filter: filterFound });
        const filterNotFound = () => false;
        const resultNotFound = (0, __1.findFilesSync)(tempDir, { filter: filterNotFound });
        expect(resultFound.length).toBe(1);
        expect(resultFound[0]).toBe(target);
        expect(resultNotFound.length).toBe(0);
    });
    test('Should be able to including folder paths', () => {
        const targets = treeNodes.map((node) => node.path).sort();
        const targetsOfFiles = treeNodes
            .filter((node) => !node.isDir)
            .map((node) => node.path)
            .sort();
        const result = (0, __1.findFilesSync)(tempDir).sort();
        const resultFiles = (0, __1.findFilesSync)(tempDir, { includeDir: false }).sort();
        const resultWithDirs = (0, __1.findFilesSync)(tempDir, { includeDir: true }).sort();
        expect(result).toEqual(targetsOfFiles);
        expect(resultFiles).toEqual(targetsOfFiles);
        expect(resultWithDirs).toEqual(targets);
    });
    test('Should support non-recursive on folders', () => {
        const targets = treeNodes
            .filter((node) => !node.isDir)
            .map((node) => node.path)
            .sort();
        const targetsNoRecursive = fs_1.default.readdirSync(tempDir)
            .map((filePath) => (0, __1.stdPath)(tempDir, filePath))
            .filter((filePath) => !fs_1.default.statSync(filePath).isDirectory())
            .sort();
        const result = (0, __1.findFilesSync)(tempDir).sort();
        const resultRecursive = (0, __1.findFilesSync)(tempDir, { recursive: true }).sort();
        const resultNoRecursive = (0, __1.findFilesSync)(tempDir, { recursive: false }).sort();
        expect(result).toEqual(targets);
        expect(resultRecursive).toEqual(targets);
        expect(resultNoRecursive).toEqual(targetsNoRecursive);
    });
    test('Should support files', () => {
        const src = (0, __1.stdPath)(__filename);
        expect((0, __1.findFilesSync)(src)).toEqual([src]);
    });
    test('Should throw error for files not founed', () => {
        [
            `/${rndStr()}`,
            rndStr(),
            `${__filename}${rndStr()}`,
        ].forEach((src) => {
            expect(() => (0, __1.findFilesSync)(src)).toThrowError();
        });
    });
});
//# sourceMappingURL=findFileSync.js.map