"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlatFileName = exports.findFilesSync = exports.copySync = exports.readFileSyncInText = exports.getFileExtension = exports.getFileName = exports.getDir = exports.getAbsPath = exports.stdPath = exports.isLocalPath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
function isLocalPath(source) {
    return fs_1.default.existsSync(source);
}
exports.isLocalPath = isLocalPath;
function stdPath(...paths) {
    const result = path_1.default.join(...paths).replace(/\\/g, '/');
    const endWithSlash = /\/$/.test(result);
    if (fs_1.default.existsSync(result) && fs_1.default.statSync(result).isDirectory()) {
        return endWithSlash ? result : `${result}/`;
    }
    return result;
}
exports.stdPath = stdPath;
function getAbsPath(source, basePath) {
    if (path_1.default.isAbsolute(source) || basePath === undefined) {
        return stdPath(source);
    }
    return stdPath(basePath, source);
}
exports.getAbsPath = getAbsPath;
function getDir(source) {
    return stdPath(path_1.default.dirname(source));
}
exports.getDir = getDir;
function getFileName(source) {
    return stdPath(source).replace(/.+\/(.+?)\/?$/, '$1');
}
exports.getFileName = getFileName;
function getFileExtension(source, options) {
    const { keepCase = false, } = options !== null && options !== void 0 ? options : {};
    const ext = path_1.default.extname(source);
    return keepCase ? ext : ext.toLowerCase();
}
exports.getFileExtension = getFileExtension;
function readFileSyncInText(source) {
    return fs_1.default.readFileSync(source, { encoding: 'utf8' });
}
exports.readFileSyncInText = readFileSyncInText;
function copySync(source, target, options) {
    if (!fs_1.default.existsSync(source)) {
        throw ReferenceError(`Source doesn't exist: ${source}`);
    }
    const { overwrite = true, } = options !== null && options !== void 0 ? options : {};
    if (fs_1.default.statSync(source).isDirectory()) {
        if (!fs_1.default.existsSync(target)) {
            fs_1.default.mkdirSync(target);
        }
        else if (!fs_1.default.statSync(target).isDirectory()) {
            throw TypeError(`Target path should be a directory: ${target}`);
        }
        fs_1.default.readdirSync(source).forEach((sub) => {
            copySync(path_1.default.join(source, sub), path_1.default.join(target, sub));
        });
    }
    else if (fs_1.default.existsSync(target)
        && fs_1.default.statSync(target).isDirectory()) {
        throw TypeError(`Target path should be a file: ${target}`);
    }
    else if (overwrite || !fs_1.default.existsSync(target)) {
        fs_1.default.writeFileSync(target, fs_1.default.readFileSync(source));
    }
}
exports.copySync = copySync;
function findFilesSync(source, options) {
    if (!fs_1.default.existsSync(source)) {
        throw ReferenceError(`Source doesn't exist: ${source}`);
    }
    const { recursive = true, includeDir = false, filter: rawFilter = () => true, } = options !== null && options !== void 0 ? options : {};
    const isSrcDir = fs_1.default.statSync(source).isDirectory();
    const subPaths = (isSrcDir
        ? fs_1.default.readdirSync(source)
        : [getFileName(source)]);
    const dir = isSrcDir ? source : getDir(source);
    const fileList = [];
    const filter = (() => {
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
        if (fs_1.default.statSync(filePath).isDirectory()) {
            if (includeDir && filter(filePath)) {
                fileList.push(filePath);
            }
            if (recursive) {
                const list = findFilesSync(filePath, Object.assign(Object.assign({}, options), { filter }));
                fileList.push(...list);
            }
        }
        else if (filter(filePath)) {
            fileList.push(filePath);
        }
    });
    return fileList;
}
exports.findFilesSync = findFilesSync;
function getFlatFileName(source, options) {
    const { hash = false, } = options !== null && options !== void 0 ? options : {};
    const extension = getFileExtension(source);
    const filename = source
        .replace(/\.[^./]+?$/, '')
        .split('/')
        .map((str) => str.replace(/[^a-z0-9]/gi, '_'))
        .join('-');
    if (hash) {
        const md5 = crypto_1.default
            .createHash('md5')
            .update(filename)
            .digest('hex');
        return `${md5}${extension}`;
    }
    return `${filename}${extension}`;
}
exports.getFlatFileName = getFlatFileName;
//# sourceMappingURL=index.js.map