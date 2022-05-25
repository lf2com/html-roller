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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsRoller = exports.jsLinkRecipe = exports.cookJSResource = exports.jsMinifyRecipe = void 0;
const fs_1 = __importDefault(require("fs"));
const terser_1 = __importDefault(require("terser"));
const _1 = require(".");
const css_1 = require("./css");
const html_1 = require("./html");
const cook_1 = require("./utils/cook");
const file_1 = require("./utils/file");
const log_1 = require("./utils/log");
const string_1 = require("./utils/string");
const jsMinifyRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { minify, jsOptions } = stdedOptions;
    if (!minify) {
        return source;
    }
    const { code } = yield terser_1.default.minify(source, Object.assign({ ie8: true, mangle: false }, jsOptions));
    return code;
});
exports.jsMinifyRecipe = jsMinifyRecipe;
function cookJSResource(resource, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const stdedOptions = (0, _1.stdRecipeOptions)(options);
        const { inputPath, outputPath, basePath, minify, } = stdedOptions;
        const resPathWithoutQuota = (0, string_1.stdQuoteStr)(resource);
        if ((0, string_1.isUrlLike)(resPathWithoutQuota)) {
            return resource;
        }
        const resPurePath = (0, string_1.getUrlWithoutExt)(resPathWithoutQuota);
        const resPath = (0, file_1.getAbsPath)(resPurePath, inputPath);
        const newResName = (0, file_1.getFlatFileName)(resPath.replace(basePath, ''), { hash: minify });
        const newResPath = (0, file_1.stdPath)(outputPath, newResName);
        const extension = (0, file_1.getFileExtension)(resPurePath);
        const q = (0, string_1.getQuote)(resource);
        try {
            switch (extension) {
                case '.html': {
                    const html = yield (0, html_1.htmlRoller)((0, file_1.readFileSyncInText)(resPath), Object.assign(Object.assign({}, stdedOptions), { inputPath: (0, file_1.getDir)(resPath) }));
                    fs_1.default.writeFileSync(newResPath, html);
                    return [q, newResName, q].join('');
                }
                case '.css': {
                    const css = yield (0, css_1.cssRoller)((0, file_1.readFileSyncInText)(resPath), stdedOptions);
                    fs_1.default.writeFileSync(newResPath, css);
                    return [q, newResName, q].join('');
                }
                case '.js': {
                    const regexJsSrcMap = /(\/\/#\W*?sourceMappingURL\W*?=\W*?)(.+?)$/;
                    const js = yield (0, exports.jsRoller)((0, file_1.readFileSyncInText)(resPath), stdedOptions);
                    const sourceMap = (_b = ((_a = js.match(regexJsSrcMap)) !== null && _a !== void 0 ? _a : [])[2]) !== null && _b !== void 0 ? _b : '';
                    const hasSourceMap = sourceMap.length > 0;
                    if (hasSourceMap) {
                        const sourceMapPath = (0, file_1.stdPath)(resPath, '..', sourceMap);
                        const newSourceMapName = `${newResName}.map`;
                        const newSourceMapPath = (0, file_1.stdPath)(newResPath, '..', newSourceMapName);
                        const newSourceMapJs = js.replace(regexJsSrcMap, `$1${newSourceMapName}`);
                        (0, file_1.copySync)(sourceMapPath, newSourceMapPath);
                        fs_1.default.writeFileSync(newResPath, newSourceMapJs);
                    }
                    else {
                        fs_1.default.writeFileSync(newResPath, js);
                    }
                    return [q, newResName, q].join('');
                }
                default: {
                    (0, file_1.copySync)(resPath, newResPath);
                    return [q, newResName, q].join('');
                }
            }
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle JS resource: ${message} @${resPurePath}`);
            (0, log_1.printError)(stack);
            return resource;
        }
    });
}
exports.cookJSResource = cookJSResource;
const jsLinkRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    return ((0, string_1.replaceStrAsync)(source, /(\Wwindow\W*?\.open\(|\.src[^\w)]*?[:=]|\W\$\W*?\.get\()([^\w'"`]*?)('[^']*'|"[^"]*"|`[^`]*`)/gm, (__, head, pad, resRawPath) => __awaiter(void 0, void 0, void 0, function* () {
        return [
            head,
            pad,
            yield cookJSResource(resRawPath, options),
        ].join('');
    })));
});
exports.jsLinkRecipe = jsLinkRecipe;
exports.jsRoller = (0, cook_1.createCook)([
    exports.jsLinkRecipe,
    exports.jsMinifyRecipe,
]);
//# sourceMappingURL=js.js.map