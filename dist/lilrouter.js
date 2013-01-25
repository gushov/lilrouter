/*! lilrouter - v0.0.5 - 2013-01-25
 * Copyright (c) 2013 August Hovland <gushov@gmail.com>; Licensed MIT */

(function (ctx) {

  "use strict";

  var defined = {};
  var exported = {};

  function resolve(from, name) {

    if (name.indexOf('.') === -1) {
      return name;
    }

    name = name.split('/');
    from = from ? from.split('/') : [];
    from.pop();

    if (name[0] === '.') {
      name.shift();
    }

    while(name[0] === '..') {
      name.shift();
      from.pop();
    }

    return from.concat(name).join('/');

  }

  //@TODO handle provide/require/define already in scope

  ctx.provide = function (name, module, isDefinition) {

    if (isDefinition) {
      return defined[name] = module;
    } else {
      return exported[name] = module;
    }

  };

  ctx.require = function (path, canonical) {

    var exports, module;
    var name = canonical || path;

    if (exported[name]) {
      return exported[name];
    } else {

      exports = exported[name] = {};
      module = { exports: exports };
      defined[name](function (path) {
        return ctx.require(path, resolve(name, path));
      }, module, exports);

      return (exported[name] = module.exports);

    }

  };

}(this));
 
provide('lil_', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

module.exports = {

  typeOf: function (x) {

    var type = typeof x;

    if (type === 'object') {
      type = Array.isArray(x) ? 'array' : type;
      type = x === null ? 'null' : type;
    }

    return type;

  },

  each: function (thing, func, ctx) {

    var type = this.typeOf(thing);
    var keys;

    if (type === 'array' && thing.length) {

      thing.forEach(func, ctx);

    } else if (type === 'object') {

      keys = thing ? Object.keys(thing) : [];

      keys.forEach(function (name, i) {
        func.call(ctx, name, thing[name], i);
      });

    }

  },

  every: function (thing, func, ctx) {

    var type = this.typeOf(thing);
    var keys;

    if (type === 'array' && thing.length) {

      return thing.every(func, ctx);

    } else if (type === 'object') {

      keys = thing ? Object.keys(thing) : [];

      return keys.every(function (name, i) {
        return func.call(ctx, name, thing[name], i);
      });

    }

    return false;

  },

  some: function (thing, func, ctx) {

    var type = this.typeOf(thing);
    var keys;

    if (type === 'array' && thing.length) {

      return thing.some(func, ctx);

    } else if (type === 'object') {

      keys = thing ? Object.keys(thing) : [];

      return keys.some(function (name, i) {
        return func.call(ctx, name, thing[name], i);
      });

    }

    return false;

  },

  map: function (thing, func, ctx) {

    var type = this.typeOf(thing);
    var result = [];

    if (type === 'array' && thing.length) {

      return thing.map(func, ctx);

    } else if (type === 'object') {

      result = {};

      this.each(thing, function (name, obj, i) {
        result[name] = func.call(this, name, obj, i);
      }, ctx);

    }

    return result;

  },

  withOut: function (arr, value) {

    var result = [];

    this.each(arr, function (element) {

      if (element !== value) {
        result.push(element);
      }

    });

    return result;

  },

  walk: function (target, source, func, fill) {
 
    var self = this;
 
    var walkObj = function (target, source) {
 
      self.each(source, function (name, obj) {
        step(target[name], obj, name, target);
      });
 
    };
 
    var step = function (target, source, name, parent) {
 
      var type = self.typeOf(source);
 
      if (type === 'object') {
 
        if (!target && parent && fill) {
          target = parent[name] = {};
        }
        
        walkObj(target, source);
 
      } else {
        func.call(parent, target, source, name);
      }
 
    };
 
    step(target, source);
 
  },

  extend: function () {

    var args = Array.prototype.slice.call(arguments);
    var target = args.shift();

    this.each(args, function (src) {

      this.each(src, function (name, value) {
        target[name] = value;
      });

    }, this);

    return target;

  },

  defaults: function (target, defaults) {

    this.each(defaults, function (name, value) {

      var type = this.typeOf(target[name]);
      if (type === 'undefined' || type === 'null') {
        target[name] = value;
      }

    }, this);

    return target;

  },

  match: function (obj, test) {

    var isMatch = true;

    this.walk(obj, test, function (target, src) {
      isMatch = (target === src);
    });

    return isMatch;

  },

  pick: function(obj, keys) {

    var picked = {};
    keys = this.typeOf(keys) === 'array' ? keys : Object.keys(keys);

    this.each(keys, function (key) {
      picked[key] = obj && obj[key];
    });

    return picked;

  }

};

}, true);

provide('lilobj/arr', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true,
  proto:true */

var _ = require('lil_');

function Arr() {

  var arr = [];
  arr.push.apply(arr, arguments);
  arr.__proto__ = Arr.prototype;

  return arr;

}

Arr.prototype = [];

Arr.prototype.isA = function (prototype) {

  function D() {}
  D.prototype = prototype;
  return this instanceof D;

};

Arr.prototype.extend = function (props) {

    Arr.prototype = this;
    var child = new Arr();

    _.each(props, function (name) {
      child[name] = props[name];
    });

    return child;
};

Arr.prototype.create = function () {

    Arr.prototype = this;
    var child = new Arr();

    if (child.construct !== undefined) {
      child.construct.apply(child, arguments);
    }

    return child;
};

module.exports = new Arr();


}, true);
provide('lilobj/obj', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var _ = require('lil_');

module.exports = {

  isA: function (prototype) {

    function D() {}
    D.prototype = prototype;
    return this instanceof D;

  },

  extend: function (props) {

    var result = Object.create(this);

    _.each(props, function (name, value) {
      result[name] = value;
    });

    return result;

  },

  create: function () {

    var object = Object.create(this);

    if (object.construct !== undefined) {
      object.construct.apply(object, arguments);
    }

    return object;

  }

};


}, true);
provide('lilobj', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var obj = require('./lilobj/obj');
var arr = require('./lilobj/arr');

module.exports = {
  obj: obj,
  arr: arr
};


}, true);

provide('lilrouter/win', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var win = typeof window === 'object' && window;

module.exports = function (winObj) {

  if (winObj) {
    win = winObj;
  }

  return {

    go: function (state, url) {
      win.history.pushState(state, '', url);
    },

    location: function (loc) {

      if (loc) {
        win.location = loc;
      }
      return win.location.pathname;

    },

    onpopstate: function (func, ctx) {
      win.onpopstate = func.bind(ctx);
    }

  };

};


}, true);
provide('lilrouter/matcher', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var _ = require('lil_');

module.exports = function (patterns, route) {

  var params, handler;

  if (route === '/') {

    return {
      handler: patterns['/'],
      params: {}
    };

  }

  _.some(patterns, function (pattern, func) {

    var routeTokens = _.withOut(route.split('/'), '');
    var patternTokens = _.withOut(pattern.split('/'), '');
    var isCountEqual = patternTokens.length === routeTokens.length;
    params = {};
    handler = func;

    if (pattern.charAt(0) !== '/') {
      patternTokens.reverse();
      routeTokens.reverse();
      isCountEqual = true;
    }

    return isCountEqual && _.every(patternTokens, function (token, i) {

      if (token.indexOf(':') === 0) {

        params[token.substr(1)] = routeTokens[i];
        return true;

      } else if (token === routeTokens[i]) {
        return true;
      } else {
        return false;
      }


    });

  });

  return {
    handler: handler,
    params: params
  };

};

}, true);
provide('lilrouter/router', function (require, module, exports) {

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
      } else if (this.win.location() !== this.start) {
        this.route('get', this.start);
      }

    }, this);

    this.route('get', this.start);

  },

  route: function (method, path, body) {

    var match = matcher(this.routes[method], path);
    var ctx = _.extend({}, this.ctx, {
      params: match.params,
      body: body || {}
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


}, true);
provide('lilrouter', function (require, module, exports) {

/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var router = require('./lilrouter/router');

module.exports = router;

}, true);
