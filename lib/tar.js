var exec = require('child_process').exec
var rm = require('rimraf')

function parse (tarFile, cb) {
  exec('tar -tf ' + tarFile, function (err, stdout) {
    if (err) {
      cb(err)
      return
    }

    var files = stdout.split('\n').filter(function (file) {
      return file
    })

    cb(null, files)
  })
}

module.exports = {
  parse: parse,
  rm: rm
}
