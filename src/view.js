/*! (C) Andrea Giammatchi - Mit Style License */
!function(window, min, object, addEventListener, resize, viewport, client, on){
  function fromElement(el, size, margin) {
    return el[client + size] - (el[client + margin] || 0);
  }
  function onresize(el) {
    el = window.document.documentElement;
    object.width = min(
      window.innerWidth,
      window.outerWidth
    ) || fromElement(el, "Width", "Left");
    object.height = min(
      window.innerHeight,
      window.outerHeight
    ) || fromElement(el, "Height", "Top");
  }
  viewport in window || onresize(
    addEventListener in window ? (
        window[addEventListener](resize, onresize, true)
        ,window[addEventListener](on + "orientationchange", onresize, true)
      ) :
      window.attachEvent(on + resize, onresize)
    , onresize(window[viewport] = object)
  );
}(this, Math.min, {}, "addEventListener", "resize", "view", "client", "on");