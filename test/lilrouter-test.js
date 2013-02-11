/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */
/*global assert, refute */

var buster = typeof buster !== 'undefined' ? buster : require("buster");
var win = typeof module !== 'undefined' ? require('../lib/lilrouter/win') : require('lilrouter/win');
var lilRouter = typeof module !== 'undefined' ? require('../lib/lilrouter') : require('lilrouter');


buster.testCase("lilrouter", {

  "should call correct init methods": function () {

    var ctx = { session: 'test' };
    var pageInit = this.stub().returns(ctx);
    var rootInit = this.spy();
    var path1Init = this.spy();
    var path2Init = this.spy();
    var path3Init = this.spy();
    var path4Init = this.spy();

    win({
      history: {
        pushState: this.spy()
      },
      location: {
        pathname: '/'
      },
      onpopstate: null
    });

    var router = lilRouter.create({

      init: pageInit,
      get: {
        '/': rootInit,
        '/path1/:var1': path1Init,
        'path3/:var3': path3Init,
        '/path4/:var4a/:var4b?': path4Init
      },
      post: {
        '/path2/:var2/edit': path2Init
      }

    });

    router.get('/path1/apples');
    router.post('/path2/nuts/edit', { id: 'id' });
    router.get('/');
    router.get('/banana/bread/path3/sugar');
    router.get('/path4/babies');

    assert.calledOnceWith(pageInit, router);

    assert.calledTwice(rootInit);
    assert.calledWith(rootInit, {
      session: 'test',
      params: {},
      body: {},
      pageload: true
    }, router);

    assert.calledOnceWith(path1Init, {
      session: 'test',
      params: { var1: 'apples' },
      body: {},
      pageload: false
    }, router);

    assert.calledOnceWith(path2Init, {
      session: 'test',
      params: { var2: 'nuts' },
      body: { id: 'id' },
      pageload: false
    });

    assert.calledOnceWith(path3Init, {
      session: 'test',
      params: { var3: 'sugar' },
      body: {},
      pageload: false
    });

    assert.calledOnceWith(path4Init, {
      session: 'test',
      params: { var4a: 'babies', var4b: undefined },
      body: {},
      pageload: false
    });

  }

});
