"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArguments = void 0;
function getArguments(options = {}) {
    const { argList = {}, inputArgv = process.argv, throwUnsupports = false, } = options;
    const argv = [];
    const args = {};
    const argKeys = Object.keys(argList);
    const argAliasKeys = argKeys.map((_, i) => argList[argKeys[i]]);
    const readNextArg = (index) => {
        if (index >= inputArgv.length) {
            return;
        }
        const arg = inputArgv[index];
        if (!/^-/.test(arg)) {
            argv.push(arg);
            readNextArg(index + 1);
            return;
        }
        const isFullName = /^--/.test(arg);
        const name = arg.replace(/^--?/, '');
        const keyIndex = (isFullName ? argKeys : argAliasKeys).indexOf(name);
        if (keyIndex === -1) {
            if (throwUnsupports) {
                throw ReferenceError(`Unknown argument: ${arg}`);
            }
            argv.push(arg);
            readNextArg(index + 1);
            return;
        }
        const valueCandidate = inputArgv[index + 1];
        const key = argKeys[keyIndex];
        if (valueCandidate === undefined || /^-/.test(valueCandidate)) {
            args[key] = true;
            readNextArg(index + 1);
            return;
        }
        args[key] = valueCandidate;
        readNextArg(index + 2);
    };
    readNextArg(0);
    return { argv, args };
}
exports.getArguments = getArguments;
//# sourceMappingURL=index.js.map