#!/usr/bin/env node

var unpack = require('../lib/index.js').unpack

unpack({
  directory: process.cwd()
}, function (err) {
  if (err) {
    console.error(err)
  }
})
