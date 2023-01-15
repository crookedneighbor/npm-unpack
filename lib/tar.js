const { promisify } = require("node:util");
const execFile = promisify(require("node:child_process").execFile);

async function parse(tarFile) {
  const { stdout } = await execFile("tar", ["-tf", tarFile]);

  return stdout.split("\n").filter((file) => file);
}

module.exports = {
  parse: parse,
};
