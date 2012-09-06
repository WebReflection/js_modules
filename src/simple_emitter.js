/*!
 * (C) WebReflection - Mit Style License
 * A simpler, better, faster, alternative to EventEmitter
 */

/**
 * @constructor SimpleEmitter
 */
function SimpleEmitter() {
  this[SECRET] = {};
}

// private shortcuts
var
  SECRET = "@",
  SimpleEmitterPrototype = SimpleEmitter.prototype,
  indexOf = [].indexOf || function indexOf(v) {
    for(var i = this.length; i-- && this[i] !== v;);
    return i;
  },
  getListener = function getListener(listeners, type) {
    return listeners[type] || (listeners[type] = []);
  },
  callListener = function callListener(self, listener, e) {
    typeof listener == "function" ?
      listener.call(self, e) :
      listener.handleEvent(e)
    ;
  }
;

/** SimpleEmitter#emit
 * trigger all listener associated with a specific type.
 * In any case passes an object to the callback/handler
 * as unique argument
 *
 * @example
 *  se.emit("name");
 *  se.emit({type: "name"});
 *  se.emit("name", {type:"name"});
 *
 * @param string|Object type the event type or the event object to pass
 * @param [Obect] event the optional object to pass as event.
 *                      Requires a type property, overwrites the type.
 */
SimpleEmitterPrototype.emit = function emit(type, e) {
  e || (e = typeof type == "string" ? {type:type} : type);
  for (var
    listeners = getListener(this[SECRET], e.type).slice(),
    i = 0;
    i < listeners.length;
    callListener(this, listeners[i++], e)
  );
  return this;
}

/** SimpleEmitter#on
 * add an event listener to the instance.
 * If the listener is there already, no reason to add it twice
 * so it won't be fired twice.
 * The context of the callback will the SimpleEmitter while
 * the context of the handler will be the handler itself.
 * Same as it is for DOM Level 3 Events
 *
 * @example
 *  se.on("stuff", function(evt){this===se});
 *  se.on("stuff", obj={handleEvent:function(evt){this===obj}});
 *
 * @param string type the event type
 * @param Function|Object listener the callback or the handler
 */
SimpleEmitterPrototype.on = function on(type, listener) {
  var listeners = getListener(this[SECRET], type);
  indexOf.call(listeners, listener) < 0 && listeners.push(listener);
  return this;
};

/** SimpleEmitter#once
 * add an event listener that is triggered only once to the instance.
 * The context of the callback will the SimpleEmitter while
 * the context of the handler will be the handler itself.
 * Same as it is for DOM Level 3 Events
 *
 * @example
 *  se.once("stuff", function(evt){this===se});
 *  se.once("stuff", obj={handleEvent:function(evt){this===obj}});
 *
 * @param string type the event type
 * @param Function|Object listener the callback or the handler
 */
SimpleEmitterPrototype.once = function once(type, listener) {
  this.on(type, function once(e) {
    this.off(type, once);
    callListener(this, listener, e);
  });
  return this;
};

/** SimpleEmitter#off
 * remove an event listener to the instance.
 * If the listener is not there, nothing will happen.
 *
 * @example
 *  se.off("stuff", callback);
 *  se.off("stuff", obj);
 *
 * @param string type the event type
 * @param Function|Object listener the callback or the handler
 */
SimpleEmitterPrototype.off = function off(type, listener) {
  var
    secret = this[SECRET],
    listeners = getListener(secret, type),
    i = indexOf.call(listeners, listener)
  ;
  -1 < i && listeners.splice(i, 1);
  if (!listeners.length) {
    delete secret[type];
  }
  return this;
};

// require("simple_emitter") is the constructor itself
module.exports = SimpleEmitter;
