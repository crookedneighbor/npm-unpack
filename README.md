## npm-unpack

Easilly pack and unpack your npm modules to see what files are being included when you npm publish

## Usage

```bash
cd /path/to/npm/module
npx npm-unpack
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

Re-run `npm-unpack` to verify:

```
npx npm-unpack
```

And see that now only our source files are included!

```
Packing your-module-name@x.y.z...

Number of files: 5

package.json
lib/foo.js
lib/bar.js
lib/baz.js
bin/your-module.js
```

## Automated Tests

```
npm test
```
