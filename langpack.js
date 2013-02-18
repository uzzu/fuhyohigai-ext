(function(undefined) {
  var lang = window.fuhyohigai.langpack = {};

  lang.ja = {
    like: 'いいね！'
  };

  lang.en = {
    like: 'Like'
  };

  lang.xx = {
    like: 'あ＾～いいっすね'
  };


  function createReversed(langpack, key) {
    var reversed = {};
    for (var lang in langpack) {
      reversed[lang] = langpack[lang][key];
    }
    return reversed;
  };

  var like = createReversed(lang, 'like');
  // var hoge = createReversed(lang, 'hoge');

  lang.like = like;
  // lang.hoge = hoge;
}).call(this);
