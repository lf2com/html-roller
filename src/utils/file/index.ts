import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Returns true if source is a local path.
 */
export function isLocalPath(source: string): boolean {
  return fs.existsSync(source);
}

/**
 * Returns standardized path.
 */
export function stdPath(...paths: string[]): string {
  const result = path.join(...paths).replace(/\\/g, '/');
  const endWithSlash = /\/$/.test(result);

  if (fs.existsSync(result) && fs.statSync(result).isDirectory()) {
    return endWithSlash ? result : `${result}/`;
  }

  return result;
}

/**
 * Returns absolute path.
 */
export function getAbsPath(source: string, basePath?: string): string {
  if (path.isAbsolute(source) || basePath === undefined) {
    return stdPath(source);
  }

  return stdPath(basePath, source);
}

/**
 * Returns directory of path.
 *
 * If the path is a directory, return its directory.
 */
export function getDir(source: string): string {
  return stdPath(path.dirname(source));
}

/**
 * Returns name of path.
 */
export function getFileName(source: string): string {
  return stdPath(source).replace(/.+\/(.+?)\/?$/, '$1');
}

/**
 * Returns file extension of path.
 */
interface GetFileExtensionOptions {
  keepCase?: boolean;
}
export function getFileExtension(
  source: string,
  options?: GetFileExtensionOptions,
): string {
  const {
    keepCase = false,
  } = options ?? {};
  const ext = path.extname(source);

  return keepCase ? ext : ext.toLowerCase();
}

/**
 * Returns file content in text.
 */
export function readFileSyncInText(source: string): string {
  return fs.readFileSync(source, { encoding: 'utf8' });
}

/**
 * Copies source file(s) to target.
 */
interface CopySyncOptions {
  overwrite?: boolean;
}
export function copySync(
  source: string,
  target: string,
  options?: CopySyncOptions,
): void {
  if (!fs.existsSync(source)) {
    throw ReferenceError(`Source doesn't exist: ${source}`);
  }

  const {
    overwrite = true,
  } = options ?? {};

  if (fs.statSync(source).isDirectory()) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    } else if (!fs.statSync(target).isDirectory()) {
      throw TypeError(`Target path should be a directory: ${target}`);
    }

    fs.readdirSync(source).forEach((sub) => {
      copySync(
        path.join(source, sub),
        path.join(target, sub),
      );
    });
  } else if (
    fs.existsSync(target)
    && fs.statSync(target).isDirectory()
  ) {
    throw TypeError(`Target path should be a file: ${target}`);
  } else if (overwrite || !fs.existsSync(target)) {
    fs.writeFileSync(target, fs.readFileSync(source));
  }
}

/**
 * Returns an array of filtered files.
 */
type FindFilesSyncFilterFunc = (filePath: string) => boolean;
interface FindFilesSyncOptions {
  recursive?: boolean;
  includeDir?: boolean;
  filter?: string | RegExp | FindFilesSyncFilterFunc;
}
export function findFilesSync(
  source: string,
  options?: FindFilesSyncOptions,
): string[] {
  if (!fs.existsSync(source)) {
    throw ReferenceError(`Source doesn't exist: ${source}`);
  }

  const {
    recursive = true,
    includeDir = false,
    filter: rawFilter = () => true,
  } = options ?? {};
  const isSrcDir = fs.statSync(source).isDirectory();
  const subPaths = (isSrcDir
    ? fs.readdirSync(source)
    : [getFileName(source)]
  );
  const dir = isSrcDir ? source : getDir(source);
  const fileList: string[] = [];
  const filter = ((): FindFilesSyncFilterFunc => {
    if (typeof rawFilter === 'string') {
      return (p) => p === rawFilter;
    }
    if (rawFilter instanceof RegExp) {
      return (p) => rawFilter.test(p);
    }

    return rawFilter;
  })();

  subPaths.forEach((filename) => {
    const filePath = stdPath(dir, filename);

    if (fs.statSync(filePath).isDirectory()) {
      if (includeDir && filter(filePath)) {
        fileList.push(filePath);
      }

      if (recursive) {
        const list = findFilesSync(filePath, { ...options, filter });

        fileList.push(...list);
      }
    } else if (filter(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Returns flat file name of path.
 */
interface GetFlatFileNameOptions {
  hash?: boolean;
}
export function getFlatFileName(
  source: string,
  options?: GetFlatFileNameOptions,
): string {
  const {
    hash = false,
  } = options ?? {};
  const extension = getFileExtension(source);
  const filename = source
    // remove extension
    .replace(/\.[^./]+?$/, '')
    .split('/')
    // set _ as the symbol of non-alphabets
    .map((str) => str.replace(/[^a-z0-9]/gi, '_'))
    // set - as the spliter between folders
    .join('-');

  if (hash) {
    const md5 = crypto
      .createHash('md5')
      .update(filename)
      .digest('hex');

    return `${md5}${extension}`;
  }

  return `${filename}${extension}`;
}
