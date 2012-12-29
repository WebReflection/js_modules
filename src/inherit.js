/*!(C) WebReflection *//** @license Mit Style */
// inspired by https://gist.github.com/4395291
this.inherit || (this.inherit = function(create){
  if (!create) {
    if ({__proto__:null} instanceof Object) {
      for (var
        Null = function Null() {},
        doc = document,
        html = doc.documentElement,
        iframe = html.insertBefore(
          doc.createElement("iframe"),
          html.lastChild
        ),
        // works down to IE7, it does NOT work in IE6
        NullPrototype = Null.prototype =
          (iframe.src = "javascript:", iframe.contentWindow.Object.prototype),

        /* this would work in IE6 too
        idoc =  iframe.contentWindow.document ||
                iframe.contentDocument ||
                iframe.document,
        NullPrototype = Null.prototype = (
                idoc.open(),
                idoc.write(
                  "<script>parent.inherit=Object.prototype<" +
                  "/script>"
                ),
                idoc.close(),
                inherit
              ),
        //*/

        xtend = html.removeChild(iframe) && function xtend(object) {
          return xtend.prototype === object ?
            (xtend.prototype = xtend, this) :
            new xtend(xtend.prototype = object)
          ;
        },
        proto = [
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "valueOf",
          "toString",
          "toLocaleString",
          "constructor"
        ],
        i = proto.length; i--;
      ) delete NullPrototype[proto[i]];
      // you know ... IE, leaks, and shit ...
      create = doc = html = iframe = NullPrototype = proto =
        function(object) {
          return object == null ? new Null : xtend(object);
        }
      ;
    } else {
      create = function(object) {
        return {__proto__: object};
      };
    }
  }
  return function(object) {
    return create(object);
  };
}(Object.create));