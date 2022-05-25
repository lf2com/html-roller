#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const arguments_1 = require("./utils/arguments");
const log_1 = require("./utils/log");
const argList = {
    input: 'i',
    output: 'o',
    minify: 'm',
    help: 'h',
};
const { args, argv } = (0, arguments_1.getArguments)({
    argList,
    inputArgv: process.argv.slice(2),
});
const { input = argv[0], output = argv[1], minify = false, help, } = args;
if (help
    || typeof output !== 'string'
    || typeof input !== 'string') {
    (0, log_1.printLog)([
        'Usage:',
        '  --input|-i:  input HTML file path',
        '  --output|-o: output directory path',
        '  --minify|-m: add this flag to minify codes and filename',
    ].join('\n'));
    process.exit();
}
(0, log_1.printLog)(`Rolling HTML: ${input}`);
(0, _1.default)(input, {
    minify: !!minify,
    outputPath: output,
})
    .then(() => {
    (0, log_1.printLog)(`Rolled HTML: ${output}`);
})
    .catch((error) => {
    const { message, stack } = error;
    (0, log_1.printError)(`Failed to roll HTML: ${message}`);
    (0, log_1.printError)(stack);
});
//# sourceMappingURL=cli.js.map