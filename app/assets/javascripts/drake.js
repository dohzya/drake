define(['./abyssa-with-deps.min.js', './qajax.min.js'], function (abyssa, qajax) {

  return function (targets) {

    qajax.getJSON("/assets/routes.json").then(function (routes) {
      var router = {};
      routes.forEach(function (route) {
        var state = abyssa.State(route.pattern, function () {
          targets[route.controller][route.action].apply(null, arguments)
        });
        router[route.target.controller + '_' + route.target.action] = state;
      });
      abyssa.Router(router).init()
    });

  }

});