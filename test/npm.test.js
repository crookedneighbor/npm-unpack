var rimraf = require("rimraf").default;
var path = require("path");
var npm = require("../lib/npm");
const { vi } = require("vitest");

describe("npm", function () {
  describe("#pack", function () {
    let modulePath;

    beforeEach(function () {
      modulePath = path.resolve("./test/fixtures/fake-package");
    });

    afterEach(function () {
      return rimraf(path.resolve("./*.tgz"));
    });

    it("returns the tarred package name", function () {
      return new Promise((done) => {
        npm.pack(modulePath, function (err, tarFile) {
          expect(err).toBeFalsy();

          expect(tarFile).to.eql("fake-package-1.2.3.tgz");

          done();
        });
      });
    });

    it("errors if file cannot be found", function () {
      return new Promise((done) => {
        npm.pack("/tmp/not-a-module", function (err) {
          expect(err).to.not.equal(null);
          expect(err.message).to.contain("Command failed");

          done();
        });
      });
    });
  });
});
