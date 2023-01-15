const sandbox = require("sinon").createSandbox();
const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const rm = require("rimraf");

chai.use(require("sinon-chai"));

const unpack = require("../lib/").unpack;
const npm = require("../lib/npm");
const tar = require("../lib/tar");

describe("unpack", function () {
  this.timeout(10000);

  beforeEach(function (done) {
    this.moduleBasePath = path.resolve("./test/fixtures/");
    this.config = {
      directory: path.join(this.moduleBasePath, "fake-package/"),
      logger: sandbox.spy(),
    };

    done();
  });

  afterEach(function (done) {
    sandbox.restore();
    rm(path.resolve("./*.tgz"), done);
  });

  it("calls cb with error if module cannot be found", function (done) {
    this.config.directory = "/tmp/path-to-non-existent-module";
    unpack(this.config, function (err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.contain("Cannot find module");

      done();
    });
  });

  it("calls cb with error if module does not have a package.json", function (done) {
    this.config.directory = path.join(
      this.moduleBasePath,
      "package-without-package-json/"
    );
    unpack(this.config, function (err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.contain("Cannot find module");

      done();
    });
  });

  it("calls cb with error if module does not have a valid package.json", function (done) {
    this.config.directory = path.join(
      this.moduleBasePath,
      "package-without-valid-package-json/"
    );
    unpack(this.config, function (err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.contain("Unexpected token }");

      done();
    });
  });

  it("calls npm pack on the provided path", function (done) {
    sandbox.spy(npm, "pack");

    unpack(
      this.config,
      function (err) {
        expect(err).to.equal(null);
        expect(npm.pack).to.be.calledWith(this.config.directory);

        done();
      }.bind(this)
    );
  });

  it("calls cb with error if npm pack errors", function (done) {
    sandbox.spy(npm, "pack");

    this.config.directory = path.join(
      this.moduleBasePath,
      "package-that-cannot-be-packed"
    );
    unpack(this.config, function (err) {
      expect(npm.pack).to.be.calledOnce; // eslint-disable-line
      expect(err).to.be.an.instanceOf(Error);

      expect(err.message).to.contain("version");

      done();
    });
  });

  it("logs packed files", function (done) {
    unpack(
      this.config,
      function (err) {
        expect(err).to.equal(null);

        var expectedLog = ["package.json", "foo.js", "index.js", "lib/bar.js"];

        expectedLog.forEach(
          function (file) {
            expect(this.config.logger).to.be.calledWith(file);
          }.bind(this)
        );

        done();
      }.bind(this)
    );
  });

  it("calls cb with error if tar parsing fails", function (done) {
    sandbox.stub(tar, "parse").yields(new Error("Tar parsing failed"));

    unpack(this.config, function (err) {
      expect(tar.parse).to.be.calledOnce; // eslint-disable-line
      expect(err.message).to.eql("Tar parsing failed");

      done();
    });
  });

  it("removes the tar file", function (done) {
    sandbox.spy(tar, "rm");

    unpack(this.config, function (err) {
      expect(err).to.equal(null);
      expect(tar.rm).to.be.calledOnce; // eslint-disable-line
      expect(tar.rm).to.be.calledWith(path.resolve("./fake-package-1.2.3.tgz"));

      done();
    });
  });

  it("calls cb with error if tar removal fails", function (done) {
    sandbox.stub(tar, "rm").yields(new Error("Tar removal failed"));

    unpack(this.config, function (err) {
      expect(tar.rm).to.be.calledOnce; // eslint-disable-line
      expect(err.message).to.eql("Tar removal failed");

      done();
    });
  });
});
