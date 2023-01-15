#!/usr/bin/env node

const { unpack } = require("../lib/index.js");

unpack({
  directory: process.cwd(),
}).catch((err) => console.error(err));
