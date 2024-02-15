(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("TextHighlight", [], factory);
	else if(typeof exports === 'object')
		exports["TextHighlight"] = factory();
	else
		root["TextHighlight"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*!
 * author: wolfgang jungmayer
 * version: 0.1.0
 * (c) 2014 - 2024
 */
var TextHighlight = /*#__PURE__*/function () {
  function TextHighlight(element, options) {
    var _this = this;
    _classCallCheck(this, TextHighlight);
    _defineProperty(this, "_hasWord", function (text) {
      var regex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.word;
      return text.match(regex);
    });
    if (!element) {
      return {
        error: true
      };
    }
    element = 'string' === typeof element ? document.querySelector(element) : element;
    if (null === element || 0 === element.length) {
      return {
        error: true
      };
    }
    this.options = options; // user options
    this.settings = Object.assign({}, TextHighlight.defaults, options);
    this.element = element;
    this._found = 0;
    if (this.settings.autoinit) {
      this.init();
    }
  }
  _createClass(TextHighlight, [{
    key: "_wrapWords",
    value: function _wrapWords(element) {
      var word = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.word;
      var text = (element.innerText || element.textContent).trim();
      if (!text.length) {
        return;
      }
      var wrapStart = "<span class=\"".concat(this.settings.className, "\">");
      var wrapEnd = '</span>';
      var result = '';
      var match;

      // no limit
      if (!this.settings.max) {
        match = text.match(word);
        if (!match) {
          return;
        }
        this._found += match.length;
        result = text.replaceAll(word, "".concat(wrapStart, "$&").concat(wrapEnd));
      } else {
        var indStart = 0;
        var indEnd = 0;
        var _iterator = _createForOfIteratorHelper(text.matchAll(word)),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var m = _step.value;
            indEnd = m.index + m[0].length;
            result += text.substring(indStart, indEnd).replace(m[0], wrapStart + m[0] + wrapEnd);
            if (this.settings.max && ++this._found === this.settings.max) {
              break;
            }
            indStart = indEnd;
          }

          // while ((match = word.exec(text)) !== null) {
          //   indEnd = word.lastIndex;
          //   result += text
          //     .substring(indStart, indEnd)
          //     .replace(match[0], wrapStart + match[0] + wrapEnd);
          //   this._found++;
          //   if (this.settings.max && this._found === this.settings.max) {
          //     break;
          //   }
          //   indStart = indEnd;
          // }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        result += text.substring(indEnd);
      }
      if (element.append) {
        element.innerHTML = result;
      } else {
        // must be wrapped
        var span = document.createElement('span');
        span.innerHTML = result;
        element.parentNode.replaceChild(span, element);
        element = span;
      }
      return element;
    }
  }, {
    key: "_childNodesAllowed",
    value: function _childNodesAllowed(node) {
      var ignore = true;
      var name = node.nodeName.toLowerCase();
      if ('script' === name || 'textarea' === name) {
        ignore = false;
      }
      return ignore;
    }
  }, {
    key: "_hlSection",
    value: function _hlSection(element) {
      var _this2 = this;
      var text = (element.innerText || element.textContent).trim();
      if ('' === text || this.settings.max && this._found >= this.settings.max) {
        return;
      }
      var children = element.childNodes;
      if ((1 === element.nodeType && 0 === element.children.length || 0 === children.length) && this._hasWord(text)) {
        var el = this._wrapWords(element);
        // this.collection.push(element);
        if (this.settings.highlightSection && !el.classList.contains(this.settings.sectionClassName)) {
          el.classList.add(this.settings.sectionClassName);
        }
        return;
      }
      children.forEach(function (child) {
        if (_this2._childNodesAllowed(child)) {
          _this2._hlSection(child);
        }
      });
    }

    /**
     * Highlight the word for the given element
     *
     * @param {*} word
     * @param {*} [element=this.element]
     * @memberof Highlighter
     */
  }, {
    key: "_hl",
    value: function _hl(word) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.element;
      if (!word) {
        return;
      }
      if (Array.isArray(word)) {
        // todo join only if minInput legth reached
        word = word.join('|');
      } else {
        // todo test regexMode with regex ;)
        var regexMode = '/' === word[0] && '/' === word[word.length - 1];
        var len = word.length - (regexMode ? 2 : 0);
        if (regexMode) {
          // regex mode
          word = word.substring(1, word.length - 1);
        } else {
          // normal mode (escape special chars)
          word = word.replace(/([()[{*+.$^\\|?])/g, '\\$1');
          if (this.settings.fullwordonly) {
            word = '\\b' + word + '\\b';
            this.settings.markwholeWord = false;
          }
          if (this.settings.markwholeWord) {
            word = '\\w*' + word + '\\w*';
          }
        }
        if (len < this.settings.minInput) {
          this.reset();
          return;
        }
      }

      // if (regexMode) {
      var flags = this.settings.caseSensitive ? 'g' : 'gi';
      this.word = new RegExp(word, flags);
      // } else {
      //   this.word = word;
      // }

      this._hlSection(element, this.word);
    }

    /**
     * Update the word
     *
     * @param {*} word
     * @memberof Highlighter
     */
  }, {
    key: "update",
    value: function update(word) {
      var start = new Date().getMilliseconds();
      this.reset();
      this._hl(word);
      var end = new Date().getMilliseconds();
      console.log(end - start);
    }

    /**
     * Reset the highlighted elements
     *
     * @memberof Highlighter
     */
  }, {
    key: "reset",
    value: function reset() {
      var _this3 = this;
      this.element.querySelectorAll('.' + this.settings.className).forEach(function (el) {
        if (el.parentElement) {
          var text = el.parentElement.innerText;
          el.parentElement.innerText = text;
        }
        // const text = el.innerText;
        // el.parentNode.replaceChild(document.createTextNode(text), el);
      });
      if (this.settings.highlightSection) {
        this.element.querySelectorAll('.' + this.settings.sectionClassName).forEach(function (el) {
          el.classList.remove(_this3.settings.sectionClassName);
        });
      }
      this._found = 0;
    }

    /**
     * returns the number of found words
     *
     * @return {*}
     * @memberof TextHighlight
     */
  }, {
    key: "getCount",
    value: function getCount() {
      return this._found;
    }

    /**
     * init function
     *
     * @return {*}
     * @memberof Highlighter
     */
  }, {
    key: "init",
    value: function init() {
      if (this.initialized) {
        return true;
      }
      var word = this.settings.word;
      if (word) {
        this._hl(word);
      }
    }
  }]);
  return TextHighlight;
}(); // default options
TextHighlight.defaults = {
  autoinit: true,
  word: null,
  max: 100,
  // max elements to highlight
  minInput: 2,
  // min input to trigger highlight
  caseSensitive: false,
  fullwordonly: false,
  // mark only if the full word is given
  markwholeWord: false,
  // mark the whole word (if a part is selected)
  className: 'highlight',
  highlightSection: false,
  sectionClassName: 'section-highlight'
};
/* harmony default export */ __webpack_exports__["default"] = (TextHighlight);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});