/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var _ = require('lil_');
var obj = require('lilobj').obj;
var matcher = require('./matcher');
var win = require('./win');

module.exports = obj.extend({

  win: undefined,
  start: undefined,
  routes: {
    get: {},
    post: {}
  },

  construct: function (config) {

    this.win = win();
    this.start = this.win.location();

    _.each(this.routes, function (method) {

      _.each(config[method], function (name, init) {
        this.routes[method][name] = init;
      }, this);

    }, this);

    this.ctx = config.init(this);

    this.win.onpopstate(function (ev) {

      if (ev.state) {
        this.route(ev.state.method, this.win.location(), ev.state.body);
      } else {
        this.route('get', this.start);
      }

    }, this);

    this.route('get', this.start, null, true);

  },

  route: function (method, path, body, pageload) {

    var match = matcher(this.routes[method], path);
    var ctx = _.extend({}, this.ctx, {
      params: match.params,
      body: body || {},
      pageload: !!pageload
    });

    match.handler(ctx, this);

  },

  get: function (path) {
    this.win.go({ method: 'get' }, path);
    this.route('get', path);
  },

  post: function (path, body) {
    this.win.go({ method: 'post', body: body }, path);
    this.route('post', path, body);
  }

});
