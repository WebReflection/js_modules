/*! please check view.js which is probably what you are looking for
 * A window event fired when the viewport size is known properly or changed
 * @license (C) Andrea Giammarchi - Mit Style License
 */
!function (exports) {

  // DOM centric module ... still compatible with server require
  var
    // exports is window ? window.window : global
    window = exports.window || global,

    // shortcuts
    screen = window.screen,
    navigator = window.navigator,
    document = window.document,

    // sniff ... unfortunately
    UA = navigator.userAgent,

    // Safari Mobile
    SM =  !navigator.standalone &&        // not stand alone
          /\biP(?:hone|od)\b/.test(UA) && // iPhone or iPod
          !/\bChrome|CriOS\b/.test(UA),   // not Chrome
    AWKM = !SM && /\bAndroid\b/.test(UA) && /\bAppleWebKit\b/.test(UA),
          // Android stock browser
    IEM9 = /IEMobile\/9\.0/.test(UA),     // IE9 MObile
    FuckingIE7 = !IEM9 && /\bMSIE\b 7\.0/.test(UA),
    // shortcuts
    ADD_EVENT_LISTENER = "addEventListener",
    REMOVE_EVENT_LISTENER = "removeEventListener",
    CREATE_EVENT = "createEvent",
    DOM_CONTENT_LOADED = "DOMContentLoaded",
    LOAD = "load",
    VIEWPORTSIZE = "viewportsize",
    ORIENTATIONCHANGE = "orientationchange",
    RESIZE = "resize",

    // add and remove listeners
    add = ADD_EVENT_LISTENER in window ?
      function (el, type, fn) {
        el[ADD_EVENT_LISTENER](type, fn, true);
      } :
      function (el, type, fn) {
        el.attachEvent("on" + type, fn);
      }
    ,
    remove = REMOVE_EVENT_LISTENER in window ?
      function (el, type, fn) {
        el[REMOVE_EVENT_LISTENER](type, fn, true);
      } :
      function (el, type, fn) {
        el.detachEvent("on" + type, fn);
      }
    ,

    // fire DOM event
    fire = CREATE_EVENT in document ?
      function (type, size) {
        e = document[CREATE_EVENT]("Event");
        e.initEvent(type, true, true);
        e.result = size;
        window.dispatchEvent(e);
        fireDOMLevel0(type);
      } :
      function (type, size) {
        e = {type: type, result: size};
        fireDOMLevel0(type);
      }
    ,

    // private shared variables
    width = 0, height = 0,
    timer = 0,
    html, body,
    htmlStyle, bodyStyle,
    htmlOverflow,
    htmlMargin,
    htmlPadding,
    htmlFontSize,
    htmlLineHeight,
    bodyDisplay,
    e
  ;

  function addTriggers() {
    add(window, ORIENTATIONCHANGE, resize);
    add(window, RESIZE, resize);
  }

  /*
  function removeTriggers() {
    remove(window, ORIENTATIONCHANGE, resize);
    remove(window, RESIZE, resize);
  }
  */

  function fireDOMLevel0(type) {
    typeof window[
      type = "on" + type
    ] == "function" && window[type](e);
    e = null;
  }

  function checkDocument() {
    if (body || (body = document.body)) {
      html = document.documentElement;
      htmlStyle = html.style;
      bodyStyle = body.style;
      addTriggers();
    }
    return !!body;
  }

  function define(e) {
    timer = 0;

    width = window.innerWidth || html.clientWidth || html.offsetHeight;
    height = window.innerHeight || html.clientHeight || html.offsetHeight;
    bodyStyle.display = bodyDisplay;

    htmlStyle.overflow = htmlOverflow;

    htmlStyle.margin = htmlMargin;
    htmlStyle.padding = htmlPadding;
    htmlStyle.fontSize = htmlFontSize;
    htmlStyle.lineHeight = htmlLineHeight;

    if (SM && height !== screen.availWidth && window == top) {
      height += 60;
    } else if(AWKM) {
      // not sure ...
    } else if(IEM9) {
      // oh gosh ... why ...
      if (height < width) {
        height -= 75;
      } else {
        height += 5;
      }
    } else if(FuckingIE7) {
      width += 19;
    }

    htmlStyle.width = width + "px";
    htmlStyle.height = height + "px";

    fire(
      VIEWPORTSIZE,
      {
        width: width,
        height: height
      }
    );

    setTimeout(addTriggers, 50);
  }

  function prepare() {
    fire(
      "before" + VIEWPORTSIZE
    );

    // hide the body, kinda mandatory
    bodyDisplay = bodyStyle.display;
    bodyStyle.display = "none";

    // change overflow
    htmlOverflow = htmlStyle.overflow;
    htmlStyle.overflow = "hidden";

    // store original data, if any
    htmlMargin = htmlStyle.margin;
    htmlPadding = htmlStyle.padding;
    htmlFontSize = htmlStyle.fontSize;
    htmlLineHeight = htmlStyle.lineHeight;

    // be sure all paddig margin things are resetted
    // together with font size and line height
    htmlStyle.margin = htmlStyle.padding =
    htmlStyle.fontSize = htmlStyle.lineHeight = 0;

    // trust percentage ...
    htmlStyle.width = htmlStyle.height = "100%";
  }

  function resize() {
    if (!timer) {
      remove(window, ORIENTATIONCHANGE, resize);
      remove(window, RESIZE, resize);
      prepare();
      timer = setTimeout(define, 500);
    }
  }

  function firstShot() {
    remove(window, DOM_CONTENT_LOADED, firstShot);
    remove(window, LOAD, firstShot);
    checkDocument();
    resize();
  }

  if (!checkDocument()) {
    add(window, DOM_CONTENT_LOADED, firstShot);
    add(window, LOAD, firstShot);
  } else {
    resize();
  }

  if (exports != window) {
    exports.width = function () {
      return width;
    };
    exports.height = function () {
      return height;
    };
  }

}(this);