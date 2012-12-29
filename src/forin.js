// agnostic Array#forEach-like way to loop over enumerable properties. fixes IE < 9
this.forIn = function (){
  /*!(C) WebReflection *//** @license Mit Style */
  var
    propertyIsEnumerable = "propertyIsEnumerable",
    toString = "toString",
    OK = {toString:1}[propertyIsEnumerable](toString),
    keys = OK || [
      propertyIsEnumerable,
      toString,
      "hasOwnProperty",
      "isPrototypeOf",
      "valueOf",
      "toLocaleString",
      "constructor"
    ],
    num = OK || function(obj, callback, self){
      for (var
        key,
        i = keys.length;
        i--;
        (key = keys[i]) in obj &&
        callback.call(
          self,
          obj[key],
          key,
          obj
        )
      );
    }
  ;
  return function forIn(obj, callback, self) {
    for(var key in obj)
      callback.call(
        self,
        obj[key],
        key,
        obj
      )
    ;
    OK || num(obj, callback, self);
  };
}();

/* example
forIn({toString:123}, function(value, key, obj) {
  alert(value === 123 && key === "toString");
});
//*/