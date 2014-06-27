define(['drake'], function (drake) {

  drake({
    Application: {
      index: function () {
        alert('entered in "index" state')
      },
      details: function (id) {
        alert('entered in "details" state')
      }
    }
  });

});