var execFile = require("child_process").execFile;

function parse(tarFile, cb) {
  execFile("tar", ["-tf", tarFile], function (err, stdout) {
    if (err) {
      cb(err);
      return;
    }

    var files = stdout.split("\n").filter(function (file) {
      return file;
    });

    cb(null, files);
  });
}

module.exports = {
  parse: parse,
};
