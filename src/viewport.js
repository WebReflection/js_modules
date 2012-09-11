function orientationchange() {
  resizeTimer = 0;
  viewport.emit({
    type: "sizechange",
    data: resetHTMLStyleAndGetSize()
  });
}

function resetHTMLStyleAndGetSize() {
  var
    documentElement = document.documentElement,
    style = documentElement.style,
    padding = style.padding,
    margin = style.margin,
    lineHeight = style.lineHeight,
    fontSize = style.fontSize,
    width = style.width,
    height = style.height,
    body = document.body,
    size
  ;
  style.padding = style.margin =
  style.lineHeight = style.fontSize = 0;
  style.width = style.height = "100%";
  documentElement.removeChild(body);
  size = getSize();
  style.padding = padding;
  style.margin = margin;
  style.lineHeight = lineHeight;
  style.fontSize = fontSize;
  style.width = width;
  style.height = height;
  documentElement.appendChild(body);
  return fixSize(size);
}

function fixSize(size) {
  size.height += /\biP(?:hone|od)\b/.test(navigator.userAgent) &&
                 !navigator.standalone ? 60 : 0;
  return size;
}

function getSize() {
  var documentElement = document.documentElement;
  return {
    width: global.innerWidth || documentElement.offsetWidth,
    height: global.innerHeight || documentElement.offsetHeight
  };
}

function resize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(orientationchange, 250);
}

function once(e) {
  global.removeEventListener(e.type, once, true);
  orientationchange();
}

var
  document = global.document,
  navigator = global.navigator,
  SimpleEmitter = require("simple_emitter"),
  viewport = new SimpleEmitter,
  resizeTimer
;

global.addEventListener("resize", resize, true);
global.addEventListener("orientationchange", orientationchange, true);
global.addEventListener("DOMContentLoaded", once, true);
global.addEventListener("load", once, true);

module.exports = viewport;