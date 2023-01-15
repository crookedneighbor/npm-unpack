var path = require("path");
var tar = require("../lib/tar");

describe("tar", () => {
  describe("#parse", () => {
    it("resolves files in a tgz file", async () => {
      var testTar = path.resolve("./test/fixtures/fake-package-1.2.3.tgz");

      const files = await tar.parse(testTar);

      expect(files).toEqual([
        "package/package.json",
        "package/.npmignore",
        "package/foo.js",
        "package/index.js",
        "package/lib/bar.js",
      ]);
    });

    it("errors if file cannot be found", async () => {
      await expect(tar.parse("/tmp/not-a-tgz")).rejects.toThrow();
    });
  });
});
