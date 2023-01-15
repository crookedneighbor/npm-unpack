## npm-unpack

[![Greenkeeper badge](https://badges.greenkeeper.io/crookedneighbor/npm-unpack.svg)](https://greenkeeper.io/)

Easilly pack and unpack your npm modules to see what files are being included when you npm publish

## Installation

```bash
npm install --global npm-unpack
```

## Usage

```bash
cd /path/to/npm/module
npm-unpack
```

You'll see something like this:

```
Packing your-module-name@x.y.z...

Number of files: 6

package.json
lib/foo.js
lib/bar.js
lib/baz.js
test/file/that/should/not/be/included.js
bin/your-module.js
```

If you have a file that shouldn't be included (such as the test file above), just add it to your `.npmignore` file and re-run `npm-unpack`

```
# .npmignore
test/*
```

```
npm-unpack
```

```
Packing your-module-name@x.y.z...

Number of files: 5

package.json
lib/foo.js
lib/bar.js
lib/baz.js
bin/your-module.js
```
