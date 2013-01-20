// e.g. experimental(window, "requestAnimationFrame");
var experimental = function (cache){
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
    }
  }
  return function experimental(object, what) {
    return cache[what] || (
      cache[what] = find(object, what)
    );
  };
}({});