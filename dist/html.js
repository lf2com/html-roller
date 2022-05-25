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
exports.htmlRoller = exports.htmlHyperLinkRecipe = exports.htmlImgLinkRecipe = exports.htmlJsScriptRecipe = exports.htmlJsLinkRecipe = exports.htmlCssStyleRecipe = exports.htmlCssLinkRecipe = exports.htmlMinifyRecipe = void 0;
const fs_1 = __importDefault(require("fs"));
const html_minifier_1 = __importDefault(require("html-minifier"));
const _1 = require(".");
const css_1 = require("./css");
const js_1 = require("./js");
const cook_1 = require("./utils/cook");
const file_1 = require("./utils/file");
const log_1 = require("./utils/log");
const string_1 = require("./utils/string");
const htmlMinifyRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { minify, htmlOptions } = stdedOptions;
    if (!minify) {
        return source;
    }
    return html_minifier_1.default.minify(source, Object.assign({ minifyCSS: true, minifyJS: true, removeComments: true, removeTagWhitespace: true, trimCustomFragments: true, collapseWhitespace: true, collapseInlineTagWhitespace: true, conservativeCollapse: true, preserveLineBreaks: false, continueOnParseError: false }, htmlOptions));
});
exports.htmlMinifyRecipe = htmlMinifyRecipe;
const htmlCssLinkRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { inputPath, outputPath, basePath, minify, } = stdedOptions;
    return (0, string_1.replaceStrAsync)(source, /(<link .*?href=")(.+?)(".*?>)/gm, (str, head, cssRelativePath, tail) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if ((0, string_1.isUrlLike)(cssRelativePath)) {
            return str;
        }
        const rel = ((_a = str.match(/\srel="(.+?)"/)) !== null && _a !== void 0 ? _a : [])[1];
        const cssPath = (0, file_1.getAbsPath)(cssRelativePath, inputPath);
        const newCssName = (0, file_1.getFlatFileName)(cssPath.replace(basePath, ''), { hash: minify });
        const newCssPath = (0, file_1.stdPath)(outputPath, newCssName);
        try {
            if (rel !== 'stylesheet') {
                (0, file_1.copySync)(cssPath, newCssPath);
            }
            else {
                const css = yield (0, css_1.cssRoller)((0, file_1.readFileSyncInText)(cssPath), Object.assign(Object.assign({}, stdedOptions), { inputPath: (0, file_1.getDir)(cssPath) }));
                fs_1.default.writeFileSync(newCssPath, css);
            }
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle CSS link: ${message} @${cssPath}`);
            (0, log_1.printError)(stack);
            return str;
        }
        return [head, newCssName, tail].join('');
    }));
});
exports.htmlCssLinkRecipe = htmlCssLinkRecipe;
const htmlCssStyleRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    return ((0, string_1.replaceStrAsync)(source, /(<style.*?>)([\w\W]+?)<\/style>/gm, (str, head, cssText) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const type = ((_b = head.match(/\stype="(.+?)"/)) !== null && _b !== void 0 ? _b : [])[1];
        if (type && type !== 'text/css') {
            return str;
        }
        try {
            return [
                '<style>',
                yield (0, css_1.cssRoller)(cssText, options),
                '</style>',
            ].join('\n');
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle CSS style: ${message} @${str}`);
            (0, log_1.printError)(stack);
            return str;
        }
    })));
});
exports.htmlCssStyleRecipe = htmlCssStyleRecipe;
const htmlJsLinkRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { inputPath, outputPath, basePath, minify, } = stdedOptions;
    return (0, string_1.replaceStrAsync)(source, /(<script .*?src=")(.+?)(".*?>[\W]*?<\/script>)/gm, (str, head, jsRelativePath, tail) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if ((0, string_1.isUrlLike)(jsRelativePath)) {
            return str;
        }
        const type = ((_c = str.match(/\stype="(.+?)"/)) !== null && _c !== void 0 ? _c : [])[1];
        const jsPath = (0, file_1.getAbsPath)(jsRelativePath, inputPath);
        const newJsName = (0, file_1.getFlatFileName)(jsPath.replace(basePath, ''), { hash: minify });
        const newJsPath = (0, file_1.stdPath)(outputPath, newJsName);
        try {
            if ((type && type !== 'text/javascript')
                || (0, file_1.getFileExtension)(jsPath) !== '.js') {
                (0, file_1.copySync)(jsPath, newJsPath);
                return [head, newJsName, tail].join('');
            }
            return [
                head,
                yield (0, js_1.cookJSResource)(jsRelativePath, stdedOptions),
                tail,
            ].join('');
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle JS link: ${message} @${jsPath}`);
            (0, log_1.printError)(stack);
            return str;
        }
    }));
});
exports.htmlJsLinkRecipe = htmlJsLinkRecipe;
const htmlJsScriptRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    return ((0, string_1.replaceStrAsync)(source, /(<script.*?>)([\w\W]*?)<\/script>/gm, (str, head, js) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const type = ((_d = head.match(/\stype="(.+?)"/)) !== null && _d !== void 0 ? _d : [])[1];
        try {
            if ((type && type !== 'text/javascript')
                || (!js || js.length === 0)) {
                return str;
            }
            return [
                '<script>',
                yield (0, js_1.jsRoller)(js, options),
                '</script>',
            ].join('\n');
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle JS script: ${message} @${str}`);
            (0, log_1.printError)(stack);
            return str;
        }
    })));
});
exports.htmlJsScriptRecipe = htmlJsScriptRecipe;
const htmlImgLinkRecipe = (source, _, options) => {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { inputPath, outputPath, basePath, minify, } = stdedOptions;
    return (0, string_1.replaceStrAsync)(source, /(<img .*?src=")(.+?)(".*?>)/gm, (str, head, imgRelativePath, tail) => {
        if ((0, string_1.isUrlLike)(imgRelativePath)) {
            return str;
        }
        const imgPath = (0, file_1.getAbsPath)(imgRelativePath, inputPath);
        const newImgName = (0, file_1.getFlatFileName)(imgPath.replace(basePath, ''), { hash: minify });
        const newImgPath = (0, file_1.stdPath)(outputPath, newImgName);
        try {
            (0, file_1.copySync)(imgPath, newImgPath);
            return [head, newImgName, tail].join('');
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle img link: ${message} @${imgPath}`);
            (0, log_1.printError)(stack);
            return str;
        }
    });
};
exports.htmlImgLinkRecipe = htmlImgLinkRecipe;
const htmlHyperLinkRecipe = (source, _, options) => {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { inputPath, outputPath, basePath, minify, } = stdedOptions;
    return (0, string_1.replaceStrAsync)(source, /(<a .*?href=")(.+?)(".*?>)/gm, (str, head, linkRelativePath, tail) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, string_1.isUrlLike)(linkRelativePath)) {
            return str;
        }
        const linkPurePath = (0, string_1.getUrlWithoutExt)(linkRelativePath);
        const linkPath = (0, file_1.getAbsPath)(linkPurePath, inputPath);
        const newLinkName = (0, file_1.getFlatFileName)(linkPath.replace(basePath, ''), { hash: minify });
        const newLinkPath = (0, file_1.stdPath)(outputPath, newLinkName);
        const extension = (0, file_1.getFileExtension)(linkPurePath);
        try {
            switch (extension) {
                case 'html': {
                    const html = yield (0, exports.htmlRoller)(linkPath, Object.assign(Object.assign({}, stdedOptions), { inputPath: (0, file_1.getDir)(linkPath) }));
                    fs_1.default.writeFileSync(newLinkPath, html);
                    break;
                }
                default: {
                    (0, file_1.copySync)(linkPath, newLinkPath);
                    break;
                }
            }
            return [head, newLinkName, tail].join('');
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle hyper link: ${message} @${linkPath}`);
            (0, log_1.printError)(stack);
            return str;
        }
    }));
};
exports.htmlHyperLinkRecipe = htmlHyperLinkRecipe;
const htmlIframeLinkRecipe = (source, _, options) => __awaiter(void 0, void 0, void 0, function* () {
    const stdedOptions = (0, _1.stdRecipeOptions)(options);
    const { inputPath, outputPath, basePath, minify, } = stdedOptions;
    return (0, string_1.replaceStrAsync)(source, /(<iframe .*?src=")(.+?)(".*?>)/gm, (str, head, iframeRelativePath, tail) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, string_1.isUrlLike)(iframeRelativePath)) {
            return str;
        }
        const iframePathNoQueryString = (0, string_1.getUrlWithoutExt)(iframeRelativePath);
        const iframePath = (0, file_1.getAbsPath)(iframePathNoQueryString, inputPath);
        const newIframeName = (0, file_1.getFlatFileName)(iframePath.replace(basePath, ''), { hash: minify });
        const newIframePath = (0, file_1.stdPath)(outputPath, newIframeName);
        try {
            const html = yield (0, exports.htmlRoller)(iframePath, Object.assign(Object.assign({}, stdedOptions), { inputPath: (0, file_1.getDir)(iframePath) }));
            fs_1.default.writeFileSync(newIframePath, html);
            return [head, newIframeName, tail].join('');
        }
        catch (error) {
            const { message, stack } = error;
            (0, log_1.printError)(`Failed to handle iframe link: ${message} @${iframePath}`);
            (0, log_1.printError)(stack);
            return str;
        }
    }));
});
exports.htmlRoller = (0, cook_1.createCook)([
    exports.htmlCssLinkRecipe,
    exports.htmlCssStyleRecipe,
    exports.htmlJsLinkRecipe,
    exports.htmlJsScriptRecipe,
    exports.htmlImgLinkRecipe,
    exports.htmlHyperLinkRecipe,
    htmlIframeLinkRecipe,
    exports.htmlMinifyRecipe,
]);
//# sourceMappingURL=html.js.map