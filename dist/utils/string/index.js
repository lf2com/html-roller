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
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceStrAsync = exports.isUrlLike = exports.getUrlWithoutExt = exports.stdQuoteStr = exports.getQuote = exports.hasQuote = void 0;
function hasQuote(source) {
    return /^('[^']*'|"[^"]*"|`[^`]*`)$/.test(source);
}
exports.hasQuote = hasQuote;
function getQuote(source) {
    return hasQuote(source) ? source[0] : '';
}
exports.getQuote = getQuote;
function stdQuoteStr(source) {
    return hasQuote(source) ? source.slice(1, -1) : source;
}
exports.stdQuoteStr = stdQuoteStr;
function getUrlWithoutExt(source) {
    return source.replace(/[#?][^/]*$/, '');
}
exports.getUrlWithoutExt = getUrlWithoutExt;
function isUrlLike(source) {
    return (/^(https?:|file:\/|wss?:)\/\//i.test(source)
        || /^#/.test(source));
}
exports.isUrlLike = isUrlLike;
function replaceStrAsync(source, search, replacer) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof replacer === 'string') {
            return source.replace(search, replacer);
        }
        const promises = [];
        source.replace(search, (...args) => {
            promises.push(Promise.resolve(replacer(...args)));
            return '';
        });
        const results = yield Promise.all(promises);
        return source.replace(search, () => results.shift());
    });
}
exports.replaceStrAsync = replaceStrAsync;
//# sourceMappingURL=index.js.map