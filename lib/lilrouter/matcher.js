/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var _ = require('lil_');

module.exports = function (patterns, route) {

  var routeTokens = _.withOut(route.split('/'), '');
  var params, handler;

  if (route === '/') {

    return {
      handler: patterns['/'],
      params: {}
    };

  }

  _.some(patterns, function (pattern, func) {

    var patternTokens = _.withOut(pattern.split('/'), '');
    var isCountEqual = patternTokens.length === routeTokens.length;
    params = {};
    handler = func;

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