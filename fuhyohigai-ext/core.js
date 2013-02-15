(function(undefined) {
  window.fuhyohigai = window.fuhyohigai || {};

  var Asserts = {
      isNotEmptyString: function(source) {
        if (!source || typeof source !== 'string') {
          throw new Error('え、それは…(困惑): source -> ' + source);
        }
      }
      , isFunction: function(source) {
        if (!source || typeof source !== 'function') {
          throw new Error('え、それは…(困惑): source -> ' + source);
        }
      }
  };

  var Entry = (function() {
    function Entry(key, value) {
      this.key = key;
      this.value = value;
    }
    return Entry;
  })();

  var Holder = (function() {
    function Holder() {
      this._entries = [];
    }

    Holder.prototype.put = function(key, value) {
      this._entries.push(new Entry(key, value));
    };

    Holder.prototype.contains = function(key, value) {
      var entriesLength = this._entries.length
        , i = 0
        , entry = null;
      for (; i < entriesLength; i++) {
        entry = this._entries[i];
        if (entry.key === key && entry.value === value) {
          return true;
        }
      }
      return false;
    };

    Holder.prototype.containsKey = function(key) {
      var entriesLength = this._entries.length
        , i = 0
        , entry = null;
      for (; i < entriesLength; i++) {
        entry = this._entries[i];
        if (entry.key === key) {
          return true;
        }
      }
      return false;
    };

    Holder.prototype.containsValue = function(value) {
      var entriesLength = this._entries.length
        , i = 0
        , entry = null;
      for (; i < entriesLength; i++) {
        entry = this._entries[i];
        if (entry.value === value) {
          return true;
        }
      }
      return false;
    };

    Holder.prototype.remove = function(key, value) {
      var entriesLength = this._entries.length
        , i = entriesLength - 1
        , entry = null;
      for (; i >= 0; i--) {
        entry = this._entries[i];
        if (entry.key === key && entry.value === value) {
          this._entries.splice(i, 1);
          return;
        }
      }
    };

    Holder.prototype.findValuesByKey = function(key) {
      var values = []
        , entriesLength = this._entries.length
        , i = 0
        , entry = null;
      for (; i < entriesLength; i++) {
        entry = this._entries[i];
        if (entry.key === key) {
          values.push(entry.value);
        }
      }
      return values;
    };

    return Holder;
  })();

  var Core = (function() {

    function Core() {
      this.interval = 60;
      this._timer = null;
      this._hostRegExps = [];
      this._listenerHolder = new Holder();
    }

    Core.prototype._dispatch = function() {
      var currentHost = window.location.host
        , hostsMatched = []
        , hostRegExpsLength = this._hostRegExps.length
        , i = 0
        , hostRegExp = null;
      for (; i < hostRegExpsLength; i++) {
        hostRegExp = this._hostRegExps[i];
        if (hostRegExp.test(currentHost)) {
          hostsMatched.push(hostRegExp.source);
        }
      }

      i = 0;
      var listeners = []
        , hostsMatchedLength = hostsMatched.length
        , hostMatched = null;
      for (; i < hostsMatchedLength; i++) {
        hostsMatched = hostsMatched[i];
        var lists = this._listenerHolder.findValuesByKey(hostsMatched);
        Array.prototype.push.apply(listeners, lists);
      }

      i = 0;
      var listenersLength = listeners.length
        , listener = null;
      for (; i < listenersLength; i++) {
        listener = listeners[i];
        listener.call();
      }
    };

    Core.prototype._onInsertDomNode = function(event) {
      if (this._timer) { return; }
      this._timer = setTimeout((function() {
        this._dispatch();
        this._timer = null;
      }).bind(this), this.interval);
    }

    Core.prototype.start = function() {
      window.document.addEventListener('DOMNodeInserted', this._onInsertDomNode.bind(this));
    };

    Core.prototype.stop = function() {
      window.document.removeEventListener('DOMNodeInserted', this._onInsertDomNode.bind(this));
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
    };

    Core.prototype.addListener = function(host, callback) {
      Asserts.isNotEmptyString(host);
      Asserts.isFunction(callback);
      if (this._listenerHolder.contains(host, callback)) {
        return;
      }
      this._listenerHolder.put(host, callback);

      var hostRegExpsLength = this._hostRegExps.length
        , i = 0
        , hostRegExp = null;
      for (; i < hostRegExpsLength; i++) {
        hostRegExp = this._hostRegExps[i];
        if (hostRegExp.source === host) {
          return;
        }
      }
      this._hostRegExps.push(new RegExp(host));
    };

    Core.prototype.contains = function(host, callback) {
      return this._listenerHolder.contains(host, callback);
    };

    Core.prototype.removeListener = function(host, callback) {
      this._listenerHolder.remove(host, callback);
      if (this._listenerHolder.findValuesByKey(host).length) {
        return;
      }
      var hostRegExpsLength = this._hostRegExps.length
        , i = hostRegExpsLength - 1
        , hostRegExp = null;
      for (; i >= 0; i--) {
        var hostRegExp = this._hostRegExps[i];
        if (hostRegExp.source === host) {
          this._hostRegExps.splice(i, 1);
        }
      }
    };

    return Core;
  })();

  window.fuhyohigai.core = new Core();
}).call(this);
