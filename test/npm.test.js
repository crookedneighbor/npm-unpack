var chai = require('chai')
var expect = chai.expect

var rimraf = require('rimraf')
var path = require('path')
var npm = require('../lib/npm')

describe('npm', function () {
  this.timeout(10000)

  describe('#pack', function () {
    beforeEach(function () {
      this.modulePath = path.resolve('./test/fixtures/fake-package')
    })

    afterEach(function (done) {
      rimraf(path.resolve('./*.tgz'), done)
    })

    it('returns the tarred package name', function (done) {
      npm.pack(this.modulePath, function (err, tarFile) {
        expect(err).to.equal(null)

        expect(tarFile).to.eql('fake-package-1.2.3.tgz')

        done()
      })
    })

    it('errors if file cannot be found', function (done) {
      npm.pack('/tmp/not-a-module', function (err) {
        expect(err).to.not.equal(null)
        expect(err.message).to.contain('Command failed')

        done()
      })
    })
  })
})
