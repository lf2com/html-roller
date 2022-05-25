import fs from 'fs';
import HtmlMinifier from 'html-minifier';
import { RecipeOptionsGeneral, stdRecipeOptions } from '.';
import { cssRoller } from './css';
import { cookJSResource, jsRoller } from './js';
import { createCook, Recipe } from './utils/cook';
import {
  copySync, getAbsPath, getDir, getFileExtension, getFlatFileName,
  readFileSyncInText, stdPath,
} from './utils/file';
import { printError } from './utils/log';
import { getUrlWithoutExt, isUrlLike, replaceStrAsync } from './utils/string';

export type HtmlOptions = HtmlMinifier.Options;

type HtmlRecipe = Recipe<RecipeOptionsGeneral>;

/**
 * Returns minified HTML text.
 */
export const htmlMinifyRecipe: HtmlRecipe = async (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const { minify, htmlOptions } = stdedOptions;

  if (!minify) {
    return source;
  }

  return HtmlMinifier.minify(source, {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    removeTagWhitespace: true,
    trimCustomFragments: true,
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: false,
    continueOnParseError: false,
    ...htmlOptions,
  });
};

/**
 * Returns CSS text converted link URLs.
 */
export const htmlCssLinkRecipe: HtmlRecipe = async (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;

  return replaceStrAsync(
    source,
    /(<link .*?href=")(.+?)(".*?>)/gm,
    async (str, head, cssRelativePath, tail) => {
      if (isUrlLike(cssRelativePath)) {
        return str;
      }

      const rel = (str.match(/\srel="(.+?)"/) ?? [])[1];
      const cssPath = getAbsPath(cssRelativePath, inputPath);
      const newCssName = getFlatFileName(
        cssPath.replace(basePath, ''),
        { hash: minify },
      );
      const newCssPath = stdPath(outputPath, newCssName);

      try {
        if (rel !== 'stylesheet') {
          copySync(cssPath, newCssPath);
        } else {
          const css = await cssRoller(readFileSyncInText(cssPath), {
            ...stdedOptions,
            inputPath: getDir(cssPath),
          });

          fs.writeFileSync(newCssPath, css);
        }
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle CSS link: ${message} @${cssPath}`);
        printError(stack);

        return str;
      }

      return [head, newCssName, tail].join('');
    },
  );
};

/**
 * Returns CSS text converted style text.
 */
export const htmlCssStyleRecipe: HtmlRecipe = async (source, _, options) => (
  replaceStrAsync(
    source,
    /(<style.*?>)([\w\W]+?)<\/style>/gm,
    async (str, head, cssText) => {
      const type = (head.match(/\stype="(.+?)"/) ?? [])[1];

      if (type && type !== 'text/css') {
        return str;
      }

      try {
        return [
          '<style>',
          await cssRoller(cssText, options),
          '</style>',
        ].join('\n');
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle CSS style: ${message} @${str}`);
        printError(stack);

        return str;
      }
    },
  )
);

/**
 * Returns JS text converted link URLs.
 */
export const htmlJsLinkRecipe: HtmlRecipe = async (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;

  return replaceStrAsync(
    source,
    /(<script .*?src=")(.+?)(".*?>[\W]*?<\/script>)/gm,
    async (str, head, jsRelativePath, tail) => {
      if (isUrlLike(jsRelativePath)) {
        return str;
      }

      const type = (str.match(/\stype="(.+?)"/) ?? [])[1];
      const jsPath = getAbsPath(jsRelativePath, inputPath);
      const newJsName = getFlatFileName(
        jsPath.replace(basePath, ''),
        { hash: minify },
      );
      const newJsPath = stdPath(outputPath, newJsName);

      try {
        if (
          (type && type !== 'text/javascript')
          || getFileExtension(jsPath) !== '.js'
        ) {
          copySync(jsPath, newJsPath);

          return [head, newJsName, tail].join('');
        }

        return [
          head,
          await cookJSResource(jsRelativePath, stdedOptions),
          tail,
        ].join('');
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle JS link: ${message} @${jsPath}`);
        printError(stack);

        return str;
      }
    },
  );
};

/**
 * Returns JS text converted scripts.
 */
export const htmlJsScriptRecipe: HtmlRecipe = async (source, _, options) => (
  replaceStrAsync(
    source,
    /(<script.*?>)([\w\W]*?)<\/script>/gm,
    async (str, head, js) => {
      const type = (head.match(/\stype="(.+?)"/) ?? [])[1];

      try {
        if (
          (type && type !== 'text/javascript')
          || (!js || js.length === 0)
        ) {
          return str;
        }

        return [
          '<script>',
          await jsRoller(js, options),
          '</script>',
        ].join('\n');
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle JS script: ${message} @${str}`);
        printError(stack);

        return str;
      }
    },
  )
);

/**
 * Returns HTML text converted image URLs.
 */
export const htmlImgLinkRecipe: HtmlRecipe = (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;

  return replaceStrAsync(
    source,
    /(<img .*?src=")(.+?)(".*?>)/gm,
    (str, head, imgRelativePath, tail) => {
      if (isUrlLike(imgRelativePath)) {
        return str;
      }

      const imgPath = getAbsPath(imgRelativePath, inputPath);
      const newImgName = getFlatFileName(
        imgPath.replace(basePath, ''),
        { hash: minify },
      );
      const newImgPath = stdPath(outputPath, newImgName);

      try {
        copySync(imgPath, newImgPath);

        return [head, newImgName, tail].join('');
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle img link: ${message} @${imgPath}`);
        printError(stack);

        return str;
      }
    },
  );
};

/**
 * Returns HTML text converted hyper link URLs.
 */
export const htmlHyperLinkRecipe: HtmlRecipe = (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;

  return replaceStrAsync(
    source,
    /(<a .*?href=")(.+?)(".*?>)/gm,
    async (str, head, linkRelativePath, tail) => {
      if (isUrlLike(linkRelativePath)) {
        return str;
      }

      const linkPurePath = getUrlWithoutExt(linkRelativePath);
      const linkPath = getAbsPath(linkPurePath, inputPath);
      const newLinkName = getFlatFileName(
        linkPath.replace(basePath, ''),
        { hash: minify },
      );
      const newLinkPath = stdPath(outputPath, newLinkName);
      const extension = getFileExtension(linkPurePath);

      try {
        switch (extension) {
          case 'html': {
            const html = await htmlRoller(linkPath, {
              ...stdedOptions,
              inputPath: getDir(linkPath),
            });

            fs.writeFileSync(newLinkPath, html);
            break;
          }

          default: {
            copySync(linkPath, newLinkPath);
            break;
          }
        }

        return [head, newLinkName, tail].join('');
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle hyper link: ${message} @${linkPath}`);
        printError(stack);

        return str;
      }
    },
  );
};

/**
 * Returns HTML text converted iframe URLs.
 */
const htmlIframeLinkRecipe: HtmlRecipe = async (source, _, options) => {
  const stdedOptions = stdRecipeOptions(options);
  const {
    inputPath, outputPath, basePath, minify,
  } = stdedOptions;

  return replaceStrAsync(
    source,
    /(<iframe .*?src=")(.+?)(".*?>)/gm,
    async (str, head, iframeRelativePath, tail) => {
      if (isUrlLike(iframeRelativePath)) {
        return str;
      }

      const iframePathNoQueryString = getUrlWithoutExt(iframeRelativePath);
      const iframePath = getAbsPath(iframePathNoQueryString, inputPath);
      const newIframeName = getFlatFileName(
        iframePath.replace(basePath, ''),
        { hash: minify },
      );
      const newIframePath = stdPath(outputPath, newIframeName);

      try {
        const html = await htmlRoller(iframePath, {
          ...stdedOptions,
          inputPath: getDir(iframePath),
        });

        fs.writeFileSync(newIframePath, html);

        return [head, newIframeName, tail].join('');
      } catch (error) {
        const { message, stack } = error as Error;

        printError(`Failed to handle iframe link: ${message} @${iframePath}`);
        printError(stack);

        return str;
      }
    },
  );
};

/**
 * Returns cooked HTML text.
 */
export const htmlRoller = createCook<RecipeOptionsGeneral>(
  [
    htmlCssLinkRecipe,
    htmlCssStyleRecipe,
    htmlJsLinkRecipe,
    htmlJsScriptRecipe,
    htmlImgLinkRecipe,
    htmlHyperLinkRecipe,
    htmlIframeLinkRecipe,
    htmlMinifyRecipe,
  ],
);
