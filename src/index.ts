import fs from 'fs';
import { CssOptions } from './css';
import { HtmlOptions, htmlRoller } from './html';
import { JsOptions } from './js';
import {
  getDir, getFileName, readFileSyncInText, stdPath,
} from './utils/file';

export interface RecipeOptionsGeneral {
  minify?: boolean;
  inputPath?: string;
  outputPath?: string;
  basePath?: string;
  jsOptions?: JsOptions;
  cssOptions?: CssOptions;
  htmlOptions?: HtmlOptions;
}

/**
 * Returns standardized recipe options.
 */
export const stdRecipeOptions = ({
  minify = false,
  inputPath = '',
  outputPath = '',
  basePath = '',
  jsOptions = {},
  cssOptions = {},
  htmlOptions = {},
}: RecipeOptionsGeneral = {}): Required<RecipeOptionsGeneral> => ({
  minify,
  inputPath,
  outputPath,
  basePath,
  jsOptions,
  cssOptions,
  htmlOptions,
});

/**
 * Outpus rolled HTML to output path.
 */
async function rollhtml(
  source: string,
  options: RecipeOptionsGeneral = {},
): Promise<void> {
  if (!fs.existsSync(source)) {
    throw ReferenceError(`HTML source not found: ${source}`);
  }

  const {
    minify = false,
    inputPath = getDir(source),
    outputPath = stdPath(__dirname),
    basePath = inputPath,
    jsOptions = {},
    cssOptions = {},
    htmlOptions = {},
  } = options;

  if (fs.existsSync(outputPath)) {
    if (!fs.statSync(outputPath).isDirectory()) {
      throw TypeError(`Output path should be a folder: ${outputPath}`);
    }
  } else {
    fs.mkdirSync(outputPath);
  }

  const htmlText = readFileSyncInText(source);
  const html = await htmlRoller(htmlText, {
    minify,
    inputPath: stdPath(inputPath),
    outputPath: stdPath(outputPath),
    basePath: stdPath(basePath),
    jsOptions,
    cssOptions,
    htmlOptions,
  });
  const htmlName = getFileName(source);
  const newHtmlPath = stdPath(outputPath, htmlName);

  fs.writeFileSync(newHtmlPath, html);
}

export default rollhtml;
