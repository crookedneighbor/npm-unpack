var childProcess = require("child_process");
var exec = childProcess.exec;

function pack(file, cb) {
  exec("npm pack " + file, function (err, stdout) {
    if (err) {
      cb(err);
      return;
    }

    var file = stdout.split("\n")[0];

    cb(null, file);
  });
}

module.exports = {
  pack: pack,
};
