/*jshint curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, sub:true, undef:true, boss:true,
  strict:false, eqnull:true, browser:true, node:true */

var win = window;

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
