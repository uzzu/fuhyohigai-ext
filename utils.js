(function(undefined) {
  var utils = window.fuhyohigai;
  var core = utils.core;


  utils.start = function() {
    return core.start();
  };

  utils.stop = function() {
    return core.stop();
  };

  utils.addListener = function(host, callback) {
    return core.addListener(host, callback);
  };

  utils.contains = function(host, callback) {
    return core.contains(host, callback);
  };

  utils.removeListener = function(host, callback) {
    return core.removeListener(host, callback);
  };

  // alias
  utils.onashasu = utils.addListener;
  utils.ossu     = utils.addListener;
  utils.ossuossu = utils.addListener;

}).call(this);
