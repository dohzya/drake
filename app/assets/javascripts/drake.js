define(['abyssa-with-deps', 'qajax'], function (abyssa, qajax) {

  return function (targets) {

    qajax.getJSON("/router").then(function (routes) {
      var router = abyssa.Router();
      var processRules = function (rules, prefix) {
        rules.forEach(function (rule) {
          if (rule.type === 'route') {
            var pattern = rule.path.reduce(function (acc, part) {
              if (typeof part === 'string') return acc + part;
              else return acc + ':' + part.name; // TODO handle regexp constraints
            }, prefix);
            var state = abyssa.State(pattern, function () {
              if (!router.isFirstTransition()) {
                targets[rule.call.controller][rule.call.method].apply(null, arguments)
              }
            });
            router.addState(rule.call.controller + '_' + rule.call.method, state);
          } else /* rule.type === 'router' */ {
            processRules(rule.rules, prefix + rule.prefix);
          }
        });
      };

      // I assume that the root object is always a router with prefix '/'
      processRules(routes.rules, '');

      router.init();
    });

  }

});