var path = require("path");
var tar = require("../lib/tar");

describe("tar", () => {
  describe("#parse", () => {
    it("returns files in a tgz file", () => {
      var testTar = path.resolve("./test/fixtures/fake-package-1.2.3.tgz");

      return new Promise((done) => {
        tar.parse(testTar, (err, files) => {
          expect(err).toBeFalsy();

          var expectedFiles = [
            "package/package.json",
            "package/.npmignore",
            "package/foo.js",
            "package/index.js",
            "package/lib/bar.js",
          ];

          expect(files).toEqual(expectedFiles);
          done();
        });
      });
    });

    it("errors if file cannot be found", () => {
      return new Promise((done) => {
        tar.parse("/tmp/not-a-tgz", (err) => {
          expect(err).toBeTruthy();

          done();
        });
      });
    });
  });
});
