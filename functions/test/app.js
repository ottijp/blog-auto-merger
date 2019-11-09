const mocha = require('mocha')
const assert = require('assert')
const sinon = require('sinon')
const App = require('../app')
const ApiClient = require('../api-client')

describe('App', () => {
  describe('_shouldMergePull', () => {
    it('should merge', () => {
      assert.equal(App._shouldMergePull('reserve-20191108-010600', new Date('2019-11-08T01:06:00+09:00')), true)
    })

    it('should not merge', () => {
      assert.equal(App._shouldMergePull('reserve-20191108-010600', new Date('2019-11-08T01:05:59+09:00')), false)
    })

    it('invalid title format', () => {
      assert.equal(App._shouldMergePull('reserve-20191108-01:06:00', new Date('2019-11-08T01:06:00+09:00')), false)
    })
  })

  describe('mergeReservedPosts', () => {
    beforeEach(() => {
      this.clock = sinon.useFakeTimers({
        now: new Date('2019-11-09T00:00:00+09:00').getTime(),
      })
    })

    afterEach(() => {
      this.clock.restore()
    })

    it('no pulls', async () => {
      const apiClientStub = sinon.stub(new ApiClient())
      const app = new App(apiClientStub)
      apiClientStub.getPulls.resolves({ data: [] })
      await app.mergeReservedPosts()
      assert.equal(apiClientStub.mergePulls.calledOnceWith([]), true)
    })

    it('single pull', async () => {
      const apiClientStub = sinon.stub(new ApiClient())
      const app = new App(apiClientStub)
      apiClientStub.getPulls.resolves({ data: [
        { title: 'reserve-20191108-150000', number: 1 },
        { title: 'reserve-20191110-150000', number: 2 },
        { title: 'reserve-20191109-150000', number: 3 },
      ] })
      await app.mergeReservedPosts()
      assert.equal(apiClientStub.mergePulls.calledOnceWith([1]), true)
    })

    it('multi pulls', async () => {
      const apiClientStub = sinon.stub(new ApiClient())
      const app = new App(apiClientStub)
      apiClientStub.getPulls.resolves({ data: [
        { title: 'reserve-20191108-150000', number: 1 },
        { title: 'reserve-20191110-150000', number: 2 },
        { title: 'reserve-20191108-230000', number: 3 },
      ] })
      await app.mergeReservedPosts()
      assert.equal(apiClientStub.mergePulls.calledOnceWith([1, 3]), true)
    })
  })
})

