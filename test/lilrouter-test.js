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
        '/path1/:var1': path1Init
      },
      post: {
        '/path2/:var2/edit': path2Init
      }

    });

    router.get('/path1/apples');
    router.post('/path2/nuts/edit', { id: 'id' });
    router.get('/');

    assert.calledOnceWith(pageInit, router);

    assert.calledTwice(rootInit);
    assert.calledWith(rootInit, {
      session: 'test',
      params: {},
      body: {}
    }, router);

    assert.calledOnceWith(path1Init, {
      session: 'test',
      params: { var1: 'apples' },
      body: {}
    }, router);

    assert.calledOnceWith(path2Init, {
      session: 'test',
      params: { var2: 'nuts' },
      body: { id: 'id' }
    });

  }

});
