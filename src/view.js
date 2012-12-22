/*! (C) Andrea Giammatchi - Mit Style License */ // 431 bytes gzipped
!function(
  window,                 // the global object
  min,                    // Math.min shortcut
  ctx,                    // canvas, will be its context
  object,                 // the view object
  ackingStorePixelRatio,  // helps discovering prefixes
  addEventListener,       // helps checking W3C way
  getContext,             // helps shortcutting repeated method access
  load,                   // helps shortcutting load event type
  resize,                 // helps shortcutting resize event type
  viewport,               // helps shortcutting object name
  client,                 // helps shortcutting clientWhat property access
  on                      // helps shrinking "on" events prefixes
){
  function fromElement(el, size, margin) {
    return el[client + size] - (el[client + margin] || 0);
  }
  function onresize(el) {
    el = window.document.documentElement;
    object.width = min(
      window.innerWidth,
      window.outerWidth
    ) ||
      // older IE does not support window.inner/outer
      fromElement(el, "Width", "Left");
    object.height = min(
      window.innerHeight,
      window.outerHeight
    ) ||
      // older IE does not support window.inner/outer
      fromElement(el, "Height", "Top");
    // will be 1 if not suported
    object.pixelRatio = window.devicePixelRatio || (
      window.screen ?
        // IE has this thing ... and it's buggy
        // since it changes with orientation change ^_^
        // better than nothing ... reliable mainly after DOM is loaded
        (screen.deviceXDPI || 1) / (screen.logicalXDPI || 1) : 1
    );
    // this is Mac Retina only, hell yeah!
    // will be 1 if not supported
    object.backingStore = (
      ctx &&
        ctx["webkitB" + ackingStorePixelRatio] ||
        ctx["mozB" + ackingStorePixelRatio] ||
        ctx["msB" + ackingStorePixelRatio] ||
        ctx["oB" + ackingStorePixelRatio] ||
        ctx["b" + ackingStorePixelRatio]
      ) || 1
    ;
  }
  // trap the context once and never again
  ctx = ctx[getContext] && ctx[getContext]("2d");
  // avoid reassignment ...
  viewport in window || onresize(
    addEventListener in window ? (
        // W3C way
        window[addEventListener]("DOMContentLoaded", onresize, true),
        window[addEventListener](load, onresize, true),
        window[addEventListener](resize, onresize, true),
        window[addEventListener]("orientationchange", onresize, true)
      ) :
      (
        // IE < 9 way
        window.attachEvent(on + load, onresize),
        window.attachEvent(on + resize, onresize)
      )
    ,
      // in any case, perform this once to assign inline
      onresize(window[viewport] = object)
  );
}(
  this,
  Math.min,
  document.createElement("canvas"),
  {},
  "ackingStorePixelRatio",
  "addEventListener",
  "getContext",
  "load",
  "resize",
  "view",
  "client",
  "on"
);