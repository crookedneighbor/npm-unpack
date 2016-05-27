var chai = require('chai')
var expect = chai.expect

var rimraf = require('rimraf')
var path = require('path')
var tar = require('../lib/tar')

describe('tar', function () {
  describe('#rm', function () {
    it('is an alias for rimraf', function () {
      expect(tar.rm).to.equal(rimraf)
    })
  })

  describe('#parse', function () {
    it('returns files in a tgz file', function (done) {
      var testTar = path.resolve('./test/fixtures/fake-package-1.2.3.tgz')

      tar.parse(testTar, function (err, files) {
        expect(err).to.not.exist

        var expectedFiles = [
          'package/package.json',
          'package/.npmignore',
          'package/foo.js',
          'package/index.js',
          'package/lib/bar.js'
        ]

        expect(files).eql(expectedFiles)
        done()
      })
    })

    it('errors if file cannot be found', function (done) {
      tar.parse('/tmp/not-a-tgz', function (err, files) {
        expect(err).to.exist

        done()
      })
    })
  })
})
