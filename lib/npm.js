const { promisify } = require("node:util");
const exec = promisify(require("node:child_process").exec);

async function pack(file) {
  const { stdout } = await exec(`npm pack ${file}`);

  return stdout.split("\n")[0];
}

module.exports = {
  pack: pack,
};
