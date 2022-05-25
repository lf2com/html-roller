#!/usr/bin/env node

import rollhtml from '.';
import { getArguments } from './utils/arguments';
import { printError, printLog } from './utils/log';

const argList = {
  input: 'i',
  output: 'o',
  minify: 'm',
  help: 'h',
};

const { args, argv } = getArguments({
  argList,
  inputArgv: process.argv.slice(2),
});
const {
  input = argv.shift(),
  output = argv.shift(),
  minify = false,
  help,
} = args;

if (
  help
  || typeof output !== 'string'
  || typeof input !== 'string'
) {
  printLog([
    'Usage:',
    '  --input|-i:  input HTML file path',
    '  --output|-o: output directory path',
    '  --minify|-m: add this flag to minify codes and filename',
  ].join('\n'));
  process.exit();
}

printLog(`Rolling HTML: ${input}`);
rollhtml(input, {
  minify: !!minify,
  outputPath: output,
})
  .then(() => {
    printLog(`Rolled HTML: ${output}`);
  })
  .catch((error) => {
    const { message, stack } = error as Error;

    printError(`Failed to roll HTML: ${message}`);
    printError(stack);
  });
