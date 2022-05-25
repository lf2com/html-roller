/**
 * Prints message.
 */
export function printLog(message: any): void {
  process.stdout.write(`${message}\n`);
}

/**
 * Prints error message.
 */
export function printError(message: any): void {
  process.stderr.write(`${message}\n`);
}
