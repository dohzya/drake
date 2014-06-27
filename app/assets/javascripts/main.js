define(['drake', 'el', 'spin'], function (drake, el, Spinner) {

  var updateView = (function () {
    var root = document.querySelector('article');
    return function (dom) {
      var spinner = new Spinner();
      spinner.spin(root);
      setTimeout(function () {
        spinner.stop();
        root.parentNode.replaceChild(dom, root);
        root = dom;
      }, 500);
    }
  })();

  // Application states (currently we just duplicate the HTML fragments defined server-side)
  drake({
    Application: {
      index: function () {
        updateView(el('article')(
          el('nav')(
            el('a', { href: '/' })('/')
          ),
          el('ul')(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) {
              return el('li')(el('a', { href: '/' + i })(i))
            })
          )
        ));
      },
      details: function (args) {
        updateView(el('article')(
          el('nav')(
            el('a', { href: '/'})('/'), ' » ' + args.id
          ),
          el('p')(args.id)
        ));
      }
    }
  });

});