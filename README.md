# lilrouter

A li'l router for your browser

## Usage

load dist/lilrouter.js or dist/lilrouter.min.js in your browser and call it like this:

```javascript
(function () {

  var lilRouter = require('lilrouter');

  var router = lilRouter.create({

    init: function (router) {
      //called on page load  
      var session = { userId: '1231l2jl12' }
      return session;
    },
    get: {
      '/': function (context, router) {
        //context.session.userId = '1231l2jl12'
      }
    },
    post: {
      '/beer/:beerId/edit': function (context, router) {
        //context.session.userId = '1231l2jl12'
        //context.params.beerId = '123lkj'
        //context.body.name = 'pils'
      }
    }

  });

  router.get('/');
  router.post('/beer/123lkj/edit', { name: 'pils' });


}());
```

## License
Copyright (c) 2012 August Hovland
Licensed under the MIT license.
