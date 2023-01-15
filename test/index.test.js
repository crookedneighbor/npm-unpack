const path = require("path");
const rm = require("rimraf").default;

const unpack = require("../lib/").unpack;
const npm = require("../lib/npm");
const tar = require("../lib/tar");

describe("unpack", () => {
  let moduleBasePath, config;

  beforeEach(() => {
    moduleBasePath = path.resolve("./test/fixtures/");
    config = {
      directory: path.join(moduleBasePath, "fake-package/"),
      logger: vi.fn(),
    };
  });

  afterEach(() => {
    return rm(path.resolve("./*.tgz"));
  });

  it("rejects with error if module cannot be found", async () => {
    config.directory = "/tmp/path-to-non-existent-module";

    await expect(unpack(config)).rejects.toThrow("Cannot find module");
  });

  it("calls cb with error if module does not have a package.json", async () => {
    config.directory = path.join(
      moduleBasePath,
      "package-without-package-json/"
    );

    await expect(unpack(config)).rejects.toThrow("Cannot find module");
  });

  it("calls cb with error if module does not have a valid package.json", async () => {
    config.directory = path.join(
      moduleBasePath,
      "package-without-valid-package-json/"
    );
    await expect(unpack(config)).rejects.toThrow("Unexpected token }");
  });

  it("calls npm pack on the provided path", async () => {
    vi.spyOn(npm, "pack");

    await unpack(config);

    expect(npm.pack).toBeCalledWith(config.directory);
  }, 10000);

  it("rejects with error if npm pack errors", async () => {
    vi.spyOn(npm, "pack");

    config.directory = path.join(
      moduleBasePath,
      "package-that-cannot-be-packed"
    );

    await expect(unpack(config)).rejects.toThrow("version");
  });

  it("logs packed files", async () => {
    await unpack(config);

    const expectedLog = ["package.json", "foo.js", "index.js", "lib/bar.js"];

    expectedLog.forEach((file) => {
      expect(config.logger).toBeCalledWith(file);
    });
  });

  it("calls cb with error if tar parsing fails", async () => {
    vi.spyOn(tar, "parse").mockRejectedValue(new Error("Tar parsing failed"));

    await expect(unpack(config)).rejects.toThrow("Tar parsing failed");

    expect(tar.parse).toBeCalledTimes(1);
  });

  // can't do this without proper mocking, which must be done with imports
  // it("removes the tar file", () => {
  //   vi.spyOn(tar, "rm");

  //   return new Promise((done) => {
  //     unpack(config, (err) => {
  //       expect(err).toBeFalsy();
  //       expect(tar.rm).toBeCalledTimes(1);
  //       expect(tar.rm).toBeCalledWith(path.resolve("./fake-package-1.2.3.tgz"));

  //       done();
  //     });
  //   });
  // });

  // can't do this without proper mocking, which must be done with imports
  // it("calls cb with error if tar removal fails", () => {
  //   vi.spyOn(tar, "rm").mockRejectedValue(new Error("Tar removal failed"));

  //   return new Promise((done) => {
  //     unpack(config, (err) => {
  //       expect(tar.rm).toBeCalledTimes(1);
  //       expect(err.message).toBe("Tar removal failed");

  //       done();
  //     });
  //   });
  // });
});
