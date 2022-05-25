export interface GetArgumentsOptions {
  argList?: Record<string, string | null>;
  inputArgv?: string[];
  throwUnsupports?: boolean;
}

interface GetArgumentsResult {
  argv: string[];
  args: Record<string, string | true>;
}

/**
 * Returns arguments of command.
 */
export function getArguments(
  options: GetArgumentsOptions = {},
): GetArgumentsResult {
  const {
    argList = {},
    inputArgv = process.argv,
    throwUnsupports = false,
  } = options;
  const argv: GetArgumentsResult['argv'] = [];
  const args: GetArgumentsResult['args'] = {};
  const argKeys = Object.keys(argList);
  const argAliasKeys = argKeys.map((_, i) => argList[argKeys[i]]);
  const readNextArg = (index: number): void => {
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
