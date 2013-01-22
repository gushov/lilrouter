# lilrouter

A li'l router for your browser

## Usage

load dist/lilrouter.js or dist/lilrouter.min.js in your browser and call it like this:

```javascript
(function () {

  var router = require('lilmodel').model;

  var beer = model.extend({

    defaults: {
      sizeInLiters: 0.5,
    },

    rules: {
      type: ['required', 'string']
      sizeInLiters: ['required', 'number', ['gte', 0.2]]
    }

  });

  var dunkel = beer.create({
    type: 'lager',
  });

  dunkel.save(function (err) {
    //callback from sync 
  });

}());
```

## License
Copyright (c) 2012 August Hovland
Licensed under the MIT license.
