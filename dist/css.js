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
exports.cssRoller = exports.cssImportRecipe = exports.cssUrlRecipe = exports.cookCssResouce = exports.cssMinifyRecipe = void 0;
const clean_css_1 = __importDefault(require("clean-css"));
const _1 = require(".");
const cook_1 = require("./utils/cook");
const file_1 = require("./utils/file");
const log_1 = require("./utils/log");
const string_1 = require("./utils/string");
const cssMinifyRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { minify, cssOptions } = stdedOptions;
    if (!minify) {
        return source;
    }
    const { errors, styles } = yield new clean_css_1.default(Object.assign(Object.assign({}, cssOptions), { returnPromise: true })).minify(source);
    if (errors.length > 0) {
        throw Error(`Failed to minify CSS: ${errors.join('\n')}`);
    }
    return styles;
});
exports.cssMinifyRecipe = cssMinifyRecipe;
function cookCssResouce(resource, options) {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { inputPath, outputPath, basePath, minify, } = stdedOptions;
    const resPathWithoutQuota = (0, string_1.stdQuoteStr)(resource);
    if ((0, string_1.isUrlLike)(resPathWithoutQuota)) {
        return resource;
    }
    const resPurePath = (0, string_1.getUrlWithoutExt)(resPathWithoutQuota);
    const resPath = (0, file_1.getAbsPath)(resPurePath, inputPath);
    const q = (0, string_1.getQuote)(resource);
    const resNewName = (0, file_1.getFlatFileName)(resPath.replace(basePath, ''), { hash: minify });
    const resNewPath = (0, file_1.stdPath)(outputPath, resNewName);
    try {
        (0, file_1.copySync)(resPath, resNewPath);
        return [q, resNewName, q].join('');
    }
    catch (error) {
        const { message, stack } = error;
        (0, log_1.printError)(`Failed to handle CSS resource: ${message} @${resPurePath}`);
        (0, log_1.printError)(stack);
        return resource;
    }
}
exports.cookCssResouce = cookCssResouce;
const cssUrlRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    return ((0, string_1.replaceStrAsync)(source, /(\burl\()(.+?)(\))/gm, (__, head, resRawPath, tail) => [
        head,
        cookCssResouce(resRawPath, options),
        tail,
    ].join('')));
});
exports.cssUrlRecipe = cssUrlRecipe;
const cssImportRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    return ((0, string_1.replaceStrAsync)(source, /^(\s*@import\s+)(.+?)(\s*;\s*)$/gm, (__, head, resRawPath, tail) => [
        head,
        cookCssResouce(resRawPath, options),
        tail,
    ].join('')));
});
exports.cssImportRecipe = cssImportRecipe;
exports.cssRoller = (0, cook_1.createCook)([
    exports.cssUrlRecipe,
    exports.cssImportRecipe,
    exports.cssMinifyRecipe,
]);
//# sourceMappingURL=css.js.map