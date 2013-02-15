(function(undefined) {
  function $replaceHtml($obj, target, replacement) {
    var html = $obj.html();
    html = html.replace(new RegExp(target, "g"), replacement);
    $obj.html(html);
  }

  function createTagContainsLike(tag, source) {
    return tag + ':contains("' + source + '")';
  };

  $(function() {
    var lang = fuhyohigai.langpack
      , xxLike = lang.xx.like
      , currentLike = null;

    switch ($('html').attr('lang')) {
      case 'en':
        currentLike = lang.en.like;
        break;
      default:
        currentLike = lang.ja.like;
        break;
    }

    var targets = [
      createTagContainsLike('a', currentLike)
      , createTagContainsLike('label', currentLike)
      , createTagContainsLike('span', currentLike)
      , createTagContainsLike('h5', currentLike)
    ];

    fuhyohigai.onashasu('www.facebook.com', function() {
      for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        $(target).each(function() {
          $replaceHtml($(this), currentLike, xxLike);
        });
      }
    });
  });
}).call(this);
