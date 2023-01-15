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

  it("calls cb with error if module cannot be found", () => {
    config.directory = "/tmp/path-to-non-existent-module";

    return new Promise((done) => {
      unpack(config, (err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.contain("Cannot find module");

        done();
      });
    });
  });

  it("calls cb with error if module does not have a package.json", () => {
    config.directory = path.join(
      moduleBasePath,
      "package-without-package-json/"
    );

    return new Promise((done) => {
      unpack(config, (err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.contain("Cannot find module");

        done();
      });
    });
  });

  it("calls cb with error if module does not have a valid package.json", () => {
    config.directory = path.join(
      moduleBasePath,
      "package-without-valid-package-json/"
    );
    return new Promise((done) => {
      unpack(config, (err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.contain("Unexpected token }");

        done();
      });
    });
  });

  it("calls npm pack on the provided path", () => {
    vi.spyOn(npm, "pack");

    return new Promise((done) => {
      unpack(config, (err) => {
        expect(err).toBeFalsy();
        expect(npm.pack).toBeCalledWith(config.directory, expect.any(Function));

        done();
      });
    });
  }, 10000);

  it("calls cb with error if npm pack errors", () => {
    vi.spyOn(npm, "pack");

    config.directory = path.join(
      moduleBasePath,
      "package-that-cannot-be-packed"
    );
    return new Promise((done) => {
      unpack(config, (err) => {
        expect(npm.pack).toBeCalledTimes(1);
        expect(err).to.be.an.instanceOf(Error);

        expect(err.message).to.contain("version");

        done();
      });
    });
  });

  it("logs packed files", () => {
    return new Promise((done) => {
      unpack(config, (err) => {
        expect(err).toBeFalsy();

        var expectedLog = ["package.json", "foo.js", "index.js", "lib/bar.js"];

        expectedLog.forEach((file) => {
          expect(config.logger).toBeCalledWith(file);
        });

        done();
      });
    });
  });

  it("calls cb with error if tar parsing fails", () => {
    vi.spyOn(tar, "parse").mockImplementation((_, cb) => {
      cb(new Error("Tar parsing failed"));
    });

    return new Promise((done) => {
      unpack(config, (err) => {
        expect(tar.parse).toBeCalledTimes(1);
        expect(err.message).toBe("Tar parsing failed");

        done();
      });
    });
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
