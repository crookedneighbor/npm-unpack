var path = require("path");
var tar = require("../lib/tar");

describe("tar", function () {
  describe("#parse", function () {
    it("returns files in a tgz file", function () {
      var testTar = path.resolve("./test/fixtures/fake-package-1.2.3.tgz");

      return new Promise((done) => {
        tar.parse(testTar, function (err, files) {
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

    it("errors if file cannot be found", function () {
      return new Promise((done) => {
        tar.parse("/tmp/not-a-tgz", function (err) {
          expect(err).toBeTruthy();

          done();
        });
      });
    });
  });
});
