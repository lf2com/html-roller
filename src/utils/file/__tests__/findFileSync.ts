import fs from 'fs';
import { findFilesSync, getFileName, stdPath } from '..';

describe('findFileSync', () => {
  const rndStr = () => Math.random().toString();
  const rndPick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
  const tempDir = stdPath(__dirname, `.tmp${rndStr()}`);
  const genFile = (filePath: string, content: string = rndStr()) => {
    fs.writeFileSync(filePath, content);
  };
  const doNode = <T extends Object>(
    node: T,
    doStuff: (currPath: string, value: string | Object) => void,
    rootPath: string = '',
  ): void => {
    Object.keys(node).forEach((name) => {
      const key = name as keyof T;
      const value = node[key];
      const currPath = stdPath(rootPath, name);

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
  const treeNodes: { isDir: boolean, path: string }[] = [];

  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);
  doNode(
    tree,
    (currPath, value) => {
      if (typeof value === 'string') {
        genFile(currPath, value);
      } else {
        fs.mkdirSync(currPath);
      }
    },
    tempDir,
  );
  doNode(
    tree,
    (currPath, value) => {
      treeNodes.push({
        path: currPath,
        isDir: typeof value !== 'string',
      });
    },
    tempDir,
  );

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('Should find file in path', () => {
    const result = findFilesSync(tempDir).sort();
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
    const result = findFilesSync(tempDir, { filter });

    expect(result.length).toBe(1);
    expect(result[0]).toBe(target);
  });

  test('Should support filter of regular expression', () => {
    const candidates = treeNodes.filter((node) => !node.isDir);
    const target = rndPick(candidates).path;
    const filterFull = new RegExp(target);
    const resultFull = findFilesSync(tempDir, { filter: filterFull });
    const filterPartial = new RegExp(`${getFileName(target)}$`);
    const resultPartial = findFilesSync(tempDir, { filter: filterPartial });

    expect(resultFull.length).toBe(1);
    expect(resultFull[0]).toBe(target);
    expect(resultPartial.length).toBe(1);
    expect(resultPartial[0]).toBe(target);
  });

  test('Should supprt filter of function', () => {
    const candidates = treeNodes.filter((node) => !node.isDir);
    const target = rndPick(candidates).path;
    const filterFound = (filePath: string) => filePath.includes(target);
    const resultFound = findFilesSync(tempDir, { filter: filterFound });
    const filterNotFound = () => false;
    const resultNotFound = findFilesSync(tempDir, { filter: filterNotFound });

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
    const result = findFilesSync(tempDir).sort();
    const resultFiles = findFilesSync(tempDir, { includeDir: false }).sort();
    const resultWithDirs = findFilesSync(tempDir, { includeDir: true }).sort();

    expect(result).toEqual(targetsOfFiles);
    expect(resultFiles).toEqual(targetsOfFiles);
    expect(resultWithDirs).toEqual(targets);
  });

  test('Should support non-recursive on folders', () => {
    const targets = treeNodes
      .filter((node) => !node.isDir)
      .map((node) => node.path)
      .sort();
    const targetsNoRecursive = fs.readdirSync(tempDir)
      .map((filePath) => stdPath(tempDir, filePath))
      .filter((filePath) => !fs.statSync(filePath).isDirectory())
      .sort();
    const result = findFilesSync(tempDir).sort();
    const resultRecursive = findFilesSync(tempDir, { recursive: true }).sort();
    const resultNoRecursive = findFilesSync(tempDir, { recursive: false }).sort();

    expect(result).toEqual(targets);
    expect(resultRecursive).toEqual(targets);
    expect(resultNoRecursive).toEqual(targetsNoRecursive);
  });

  test('Should support files', () => {
    const src = stdPath(__filename);

    expect(findFilesSync(src)).toEqual([src]);
  });

  test('Should throw error for files not founed', () => {
    [
      `/${rndStr()}`,
      rndStr(),
      `${__filename}${rndStr()}`,
    ].forEach((src) => {
      expect(() => findFilesSync(src)).toThrowError();
    });
  });
});
