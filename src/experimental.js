// e.g. experimental(window, "requestAnimationFrame");
var
  define = define || Object,
  exports = this.exports || this
;
define(
  exports.experimental = function (cache){
    var prefixes = [
      // in reversed order
      // of importance
      "O",    "o",
      "MS",   "ms",
      "Moz",  "moz",
      "WebKit", "Webkit", "webKit",
      "webkit",
      ""
    ];
    function low(key) {
      return key.toLowerCase();
    }
    function find(object, what) {
      for(var
        firstChar = what.charAt(0),
        what = what.slice(1),
        i = prefixes.length,
        key; i--;
      ) {
        key = prefixes[i];
        key += (
          key ? firstChar.toUpperCase() : firstChar
        ) + what;
        if (key in object) return object[key];
        // this is about CSS stuff
        if (("on" + key) in object) return key;
        if (low("on" + key) in object) return low(key);
      }
    }
    return function experimental(object, what) {
      return cache[what] || (
        cache[what] = find(object, what)
      );
    };
  }({})
);

/*
alert([
  experimental(window, "indexedDB"),
  experimental(window, "URL"),
  experimental(window, "requestAnimationFrame"),
  experimental(document, "readyStateChange"),
  experimental(window, "transitionEnd")
].join("\n"));
//*/