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

    params = {};
    handler = func;

    if (pattern.charAt(0) !== '/') {
      routeTokens.reverse();
      patternTokens.reverse();
      routeTokens = routeTokens.slice(0, patternTokens.length);
    } else {
      routeTokens.length = patternTokens.length;
    }

    return _.every(patternTokens, function (token, i) {

      var isParam = token.indexOf(':') === 0;
      var isOptional = token.charAt(token.length - 1) === '?';
      var tokenName;

      if (isParam && (isOptional || routeTokens[i])) {

        tokenName = isOptional ?
          token.substr(1, token.length - 2) :
          token.substr(1);
        params[tokenName] = routeTokens[i];
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