import fs from 'fs';
import { copySync, stdPath } from '..';

describe('copySync', () => {
  const rndStr = () => Math.random().toString();
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

  beforeEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);
  });
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('Should copy file', () => {
    const src = stdPath(tempDir, rndStr());
    const target = stdPath(tempDir, rndStr());

    genFile(src);
    copySync(src, target);
    expect(fs.readFileSync(target))
      .toStrictEqual(fs.readFileSync(src));
  });

  test('Should copy folder', () => {
    const srcDir = stdPath(tempDir, rndStr());
    const targetDir = stdPath(tempDir, rndStr());
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
    const srcPaths: string[] = [];

    fs.mkdirSync(srcDir);
    doNode(
      tree,
      (currPath, value) => {
        if (typeof value === 'string') {
          genFile(currPath, value);
          srcPaths.push(currPath);
        } else {
          fs.mkdirSync(currPath);
        }
      },
      srcDir,
    );
    copySync(srcDir, targetDir);
    doNode(
      tree,
      (currPath, value) => {
        const isDir = fs.statSync(currPath).isDirectory();

        expect(fs.existsSync(currPath)).toBe(true);
        expect(isDir).toBe(typeof value !== 'string');

        if (!isDir) {
          const content = fs.readFileSync(currPath, { encoding: 'utf8' });

          expect(content).toBe(value);
        }
      },
      targetDir,
    );
  });

  test('Should support overwrite option', () => {
    const src = stdPath(tempDir, rndStr());
    const target = stdPath(tempDir, rndStr());

    genFile(src);

    const rawContent = fs.readFileSync(src);

    copySync(src, target);
    expect(fs.readFileSync(target)).toStrictEqual(rawContent);
    genFile(src);
    copySync(src, target, { overwrite: false });
    expect(fs.readFileSync(target)).toStrictEqual(rawContent);
    copySync(src, target, { overwrite: true });
    expect(fs.readFileSync(target)).toStrictEqual(fs.readFileSync(src));
    genFile(src);
    copySync(src, target);
    expect(fs.readFileSync(target)).toStrictEqual(fs.readFileSync(src));
  });

  test('Should throw error for no source', () => {
    expect(() => {
      copySync(
        `${__filename}${rndStr()}`,
        `${__filename}${rndStr()}`,
      );
    }).toThrow(ReferenceError);
  });

  test('Should throw error for not matched source type and target type', () => {
    const dir = stdPath(tempDir, rndStr());
    const file = stdPath(tempDir, rndStr());

    fs.mkdirSync(dir);
    genFile(file);
    expect(() => copySync(dir, file)).toThrowError();
    expect(() => copySync(file, dir)).toThrowError();
  });
});
