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

      //bind after initial page load to ignore firefox
      setTimeout(function () {
        win.onpopstate = func.bind(ctx);
      }, 0);

    }

  };

};
