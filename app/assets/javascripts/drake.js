define(['abyssa-with-deps', 'qajax'], function (abyssa, qajax) {

  return function (targets) {

    qajax.getJSON("/assets/routes.json").then(function (routes) {
      var router = abyssa.Router();
      routes.forEach(function (route) {
        var state = abyssa.State(route.pattern, function () {
          if (!router.isFirstTransition()) {
            targets[route.target.controller][route.target.action].apply(null, arguments)
          }
        });
        router.addState(route.target.controller + '_' + route.target.action, state);
      });
      router.init();
    });

  }

});