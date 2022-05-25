# Rollhtml

Rollhtml is a Node.js module for flattening resources of input HTML to the same layer of output folder.

## Usage

### Command Line

Directly run rollhtml with your HTML file:

```sh
# roll HTML
npx rollhtml PATH/TO/SOURCE.html PATH/TO/OUTPUT
# or
npx rollhtml -i PATH/TO/SOURCE.html -o PATH/TO/OUTPUT

# roll HTML with minifying codes and filenames
npx rollhtml PATH/TO/SOURCE.html PATH/TO/OUTPUT -m
```

### Module

Install rollhtml:

```sh
npm i rollhtml
```

Import in your code:

```js
import rollhtml from 'rollhtml';
// or
const rollhtml = require('rollhtml');

rollhtml(sourceHtmlPath, {
  minify: true,
  outputPath: PATH/TO/OUTPUT,
  jsOptions: {
    // minify options of terser
  },
  cssOptions: {
    // minify options of clean-css
  },
  htmlOptions: {
    // minify options of html-minifier
  },
})
  .then(() => {
    console.log('Done');
  })
  .catch((error) => {
    console.warn(`Error occurs: ${error.message}`);
  });
```

## License

[MIT](/LICENSE) Copyright @ Wan Wan
