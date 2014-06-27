define(['drake'], function (drake) {

  drake({
    Application: {
      index: function () {
        console.log('entered in "index" state')
        
      },
      details: function (id) {
        console.log('entered in "details" state')
      }
    }
  });

});