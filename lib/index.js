var path = require("path");
var npm = require("./npm");
var tar = require("./tar");
var rm = require("rimraf").default;

function unpack(config, cb) {
  var directory = config.directory;
  var logger = config.logger || console.log;

  try {
    var pkg = require(path.join(directory, "package.json"));
  } catch (err) {
    return cb(err);
  }

  logger("Packing " + pkg.name + "@" + pkg.version + "...\n");

  npm.pack(directory, function (err, tarFile) {
    if (err) {
      cb(err);
      return;
    }

    var tarFilePath = path.resolve("./", tarFile);

    tar.parse(tarFilePath, function (err, files) {
      if (err) {
        cb(err);
        return;
      }

      logger("Number of files:", files.length, "\n");

      files = files.map(function (file) {
        return file.substring(8);
      });

      files.forEach(function (file) {
        logger(file);
      });

      rm(tarFilePath)
        .then((result) => cb(result))
        .catch(cb);
    });
  });
}

exports.unpack = unpack;
