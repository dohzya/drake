define(['abyssa-with-deps', 'qajax'], function (abyssa, qajax) {

  return function (targets) {

    qajax.getJSON("/router").then(function (routes) {
      var router = abyssa.Router();
      routes.forEach(function (route) {
        var pattern = route.path.reduce(function (acc, part) {
          if (typeof part === 'string') return acc + part;
          else return acc + ':' + part.name; // TODO handle regexp constraints
        }, '');
        var state = abyssa.State(pattern, function () {
          if (!router.isFirstTransition()) {
            targets[route.call.controller][route.call.method].apply(null, arguments)
          }
        });
        router.addState(route.call.controller + '_' + route.call.method, state);
      });
      router.init();
    });

  }

});