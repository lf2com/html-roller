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
exports.stdRecipeOptions = void 0;
const fs_1 = __importDefault(require("fs"));
const html_1 = require("./html");
const file_1 = require("./utils/file");
const stdRecipeOptions = ({ minify = false, inputPath = '', outputPath = '', basePath = '', jsOptions = {}, cssOptions = {}, htmlOptions = {}, } = {}) => ({
    minify,
    inputPath,
    outputPath,
    basePath,
    jsOptions,
    cssOptions,
    htmlOptions,
});
exports.stdRecipeOptions = stdRecipeOptions;
function rollhtml(source, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(source)) {
            throw ReferenceError(`HTML source not found: ${source}`);
        }
        const { minify = false, inputPath = (0, file_1.getDir)(source), outputPath = (0, file_1.stdPath)(__dirname), basePath = inputPath, jsOptions = {}, cssOptions = {}, htmlOptions = {}, } = options;
        if (fs_1.default.existsSync(outputPath)) {
            if (!fs_1.default.statSync(outputPath).isDirectory()) {
                throw TypeError(`Output path should be a folder: ${outputPath}`);
            }
        }
        else {
            fs_1.default.mkdirSync(outputPath);
        }
        const htmlText = (0, file_1.readFileSyncInText)(source);
        const html = yield (0, html_1.htmlRoller)(htmlText, {
            minify,
            inputPath: (0, file_1.stdPath)(inputPath),
            outputPath: (0, file_1.stdPath)(outputPath),
            basePath: (0, file_1.stdPath)(basePath),
            jsOptions,
            cssOptions,
            htmlOptions,
        });
        const htmlName = (0, file_1.getFileName)(source);
        const newHtmlPath = (0, file_1.stdPath)(outputPath, htmlName);
        fs_1.default.writeFileSync(newHtmlPath, html);
    });
}
exports.default = rollhtml;
//# sourceMappingURL=index.js.map