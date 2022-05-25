"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = exports.printLog = void 0;
function printLog(message) {
    process.stdout.write(`${message}\n`);
}
exports.printLog = printLog;
function printError(message) {
    process.stderr.write(`${message}\n`);
}
exports.printError = printError;
//# sourceMappingURL=index.js.map