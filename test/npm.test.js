const rimraf = require("rimraf").default;
const path = require("path");
const npm = require("../lib/npm");

describe("npm", () => {
  describe("#pack", () => {
    let modulePath;

    beforeEach(() => {
      modulePath = path.resolve("./test/fixtures/fake-package");
    });

    afterEach(() => {
      return rimraf(path.resolve("./*.tgz"));
    });

    it("resolves the tarred package name", async () => {
      const tarFile = await npm.pack(modulePath);

      expect(tarFile).toBe("fake-package-1.2.3.tgz");
    });

    it("errors if file cannot be found", async () => {
      await expect(npm.pack("/tmp/not-a-module")).rejects.toThrow(
        "Command failed"
      );
    });
  });
});
