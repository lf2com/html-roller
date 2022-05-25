import fs from 'fs';
import terser from 'terser';
import { RecipeOptionsGeneral, stdRecipeOptions } from '.';
import { cssRoller } from './css';
import { htmlRoller } from './html';
import { createCook, Recipe } from './utils/cook';
import {
  copySync, getAbsPath, getDir, getFileExtension, getFlatFileName,
  readFileSyncInText, stdPath,
} from './utils/file';
import { printError } from './utils/log';
import {
  getQuote, getUrlWithoutExt, isUrlLike, replaceStrAsync, stdQuoteStr,
} from './utils/string';

export type JsOptions = terser.MinifyOptions;

type JsRecipe = Recipe<RecipeOptionsGeneral>;

/**
 * Returns minified JS text.
 */
export const jsMinifyRecipe: JsRecipe = async (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const { minify, jsOptions } = stdedOptions;

  if (!minify) {
    return source;
  }

  const { code } = await terser.minify(source, {
    ie8: true,
    mangle: false,
    ...jsOptions,
  });

  return code as string;
};

/**
 * Returns cooked JS URL.
 */
export async function cookJSResource(
  resource: string,
  options?: RecipeOptionsGeneral,
): Promise<string> {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;
  const resPathWithoutQuota = stdQuoteStr(resource);

  if (isUrlLike(resPathWithoutQuota)) {
    return resource;
  }

  const resPurePath = getUrlWithoutExt(resPathWithoutQuota);
  const resPath = getAbsPath(resPurePath, inputPath);
  const newResName = getFlatFileName(
    resPath.replace(basePath, ''),
    { hash: minify },
  );
  const newResPath = stdPath(outputPath, newResName);
  const extension = getFileExtension(resPurePath);
  const q = getQuote(resource);

  try {
    switch (extension) {
      case '.html': {
        const html = await htmlRoller(readFileSyncInText(resPath), {
          ...stdedOptions,
          inputPath: getDir(resPath),
        });

        fs.writeFileSync(newResPath, html);

        return [q, newResName, q].join('');
      }

      case '.css': {
        const css = await cssRoller(readFileSyncInText(resPath), stdedOptions);

        fs.writeFileSync(newResPath, css);

        return [q, newResName, q].join('');
      }

      case '.js': {
        const regexJsSrcMap = /(\/\/#\W*?sourceMappingURL\W*?=\W*?)(.+?)$/;
        const js = await jsRoller(readFileSyncInText(resPath), stdedOptions);
        const sourceMap = (js.match(regexJsSrcMap) ?? [])[2] ?? '';
        const hasSourceMap = sourceMap.length > 0;

        if (hasSourceMap) {
          const sourceMapPath = stdPath(resPath, '..', sourceMap);
          const newSourceMapName = `${newResName}.map`;
          const newSourceMapPath = stdPath(newResPath, '..', newSourceMapName);
          const newSourceMapJs = js.replace(regexJsSrcMap, `$1${newSourceMapName}`);

          copySync(sourceMapPath, newSourceMapPath);
          fs.writeFileSync(newResPath, newSourceMapJs);
        } else {
          fs.writeFileSync(newResPath, js);
        }

        return [q, newResName, q].join('');
      }

      default: {
        copySync(resPath, newResPath);

        return [q, newResName, q].join('');
      }
    }
  } catch (error) {
    const { message, stack } = error as Error;

    printError(`Failed to handle JS resource: ${message} @${resPurePath}`);
    printError(stack);

    return resource;
  }
}

/**
 * Returns JS text converted links.
 */
export const jsLinkRecipe: JsRecipe = async (source, _, options) => (
  replaceStrAsync(
    source,
    /(\Wwindow\W*?\.open\(|\.src[^\w)]*?[:=]|\W\$\W*?\.get\()([^\w'"`]*?)('[^']*'|"[^"]*"|`[^`]*`)/gm,
    async (__, head, pad, resRawPath) => [
      head,
      pad,
      await cookJSResource(resRawPath, options),
    ].join(''),
  )
);

/**
 * Returns cooked JS text.
 */
export const jsRoller = createCook<RecipeOptionsGeneral>(
  [
    jsLinkRecipe,
    jsMinifyRecipe,
  ],
);
