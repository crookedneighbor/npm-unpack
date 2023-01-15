var path = require("path");
var npm = require("./npm");
var tar = require("./tar");
var rm = require("rimraf").default;

async function unpack(config) {
  const directory = config.directory;
  const logger = config.logger || console.log;
  let pkg;

  try {
    pkg = require(path.join(directory, "package.json"));
  } catch (err) {
    return Promise.reject(err);
  }

  logger("Packing " + pkg.name + "@" + pkg.version + "...\n");

  const tarFile = await npm.pack(directory);

  const tarFilePath = path.resolve("./", tarFile);

  const files = await tar.parse(tarFilePath);

  logger("Number of files:", files.length, "\n");

  files
    .map((file) => {
      // remove the leading "package/" string from the name
      return file.split("package/")[1];
    })
    .forEach((file) => logger(file));

  await rm(tarFilePath);
}

exports.unpack = unpack;
