var rimraf = require("rimraf").default;
var path = require("path");
var npm = require("../lib/npm");

describe("npm", () => {
  describe("#pack", () => {
    let modulePath;

    beforeEach(() => {
      modulePath = path.resolve("./test/fixtures/fake-package");
    });

    afterEach(() => {
      return rimraf(path.resolve("./*.tgz"));
    });

    it("returns the tarred package name", () => {
      return new Promise((done) => {
        npm.pack(modulePath, (err, tarFile) => {
          expect(err).toBeFalsy();

          expect(tarFile).to.eql("fake-package-1.2.3.tgz");

          done();
        });
      });
    });

    it("errors if file cannot be found", () => {
      return new Promise((done) => {
        npm.pack("/tmp/not-a-module", () => {
          expect(err).to.not.equal(null);
          expect(err.message).to.contain("Command failed");

          done();
        });
      });
    });
  });
});
