define(['drake', 'el', 'spin', 'q'], function (drake, el, Spinner, Q) {

  var updateView = (function () {
    var root = document.querySelector('article');
    return function (dom) {
      var spinner = new Spinner();
      spinner.spin(root);
      Q.delay(400).then(function () {
        spinner.stop();
        root.parentNode.replaceChild(dom, root);
        root = dom;
      });
    }
  })();

  // Application states (currently we just duplicate the HTML fragments defined server-side)
  drake(function (router) {
    return {
      Application: {
        index: function () {
          updateView(el('article')(
            el('nav')(
              el('a', { href: router.link('Application.index') })('/')
            ),
            el('ul')(
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) {
                return el('li')(el('a', { href: router.link('Application.details', { id: i }) })(i))
              })
            )
          ));
        },
        details: function (args) {
          updateView(el('article')(
            el('nav')(
              el('a', { href: router.link('Application.index') })('/'), ' » ' + args.id
            ),
            el('p')(args.id)
          ));
        }
      }
    }
  });

});