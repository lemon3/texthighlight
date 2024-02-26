/*!
 * author:  wolfgang jungmayer
 * version: 0.2.1
 * (c) 2014-2024 - lemon3.at
 */
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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var TextHighlight = /*#__PURE__*/function () {
  function TextHighlight(element, options) {
    _classCallCheck(this, TextHighlight);
    _defineProperty(this, "notAllowedNodes", /script|textarea|input/);
    if (!element) {
      element = document.body;
    }
    element = 'string' === typeof element ? document.querySelector(element) : element;
    if (null === element || 0 === element.length) {
      return {
        error: true
      };
    }
    this.options = options || {}; // user options
    this.settings = Object.assign({}, TextHighlight.defaults, options);
    this.element = element;
    this._found = 0;
    this.rand = Math.random() * 1000000 << 0;
    if (this.settings.autoinit) {
      this.init();
    }
  }
  _createClass(TextHighlight, [{
    key: "_hasWord",
    value:
    /**
     * check if given element contains the given input word
     *
     * @param {*} element the element within which to search
     * @param {*} regex the word to search for as regex
     * @return {*}  {boolean}
     * @memberof TextHighlight
     */
    function _hasWord(element, regex) {
      var text = element.textContent;
      if (!element.textContent.trim()) {
        return false;
      }
      return text.match(regex) ? true : false;
    }

    /**
     * check if the given node allowed nodes
     *
     * @param {*} node the node to test
     * @return {boolean} if the given node is allowed or not
     * @memberof TextHighlight
     */
  }, {
    key: "_isNodesAllowed",
    value: function _isNodesAllowed(node) {
      var name = node.nodeName.toLowerCase();
      return !name.match(this.notAllowedNodes);
    }

    /**
     *
     *
     * @param {*} element the parent-element of the found text
     * @param {*} regex the text to search for
     * @return {*}
     * @memberof TextHighlight
     */
  }, {
    key: "_markText",
    value: function _markText(element, regex) {
      if (!element.data) {
        return;
      }
      var pa = element.parentNode;
      var result = '';
      var str = element.data;
      var marked = 0;
      while (str && null !== (result = regex.exec(str))) {
        var el = document.createElement('span');
        el.className = this.settings.className;
        el.appendChild(document.createTextNode(result[0]));
        element.replaceData(result.index, result[0].length, '');
        element = element.splitText(result.index);
        marked++;
        str = element.data;

        // mark as beeing used
        el.dataset['marked-' + this.rand] = true;
        if (str) {
          pa.insertBefore(el, element);
        } else {
          pa.appendChild(el);
          break;
        }
      }
      return marked;
    }
  }, {
    key: "_replaceText",
    value: function _replaceText(element, regex, newWord) {
      if (!element.data) {
        return;
      }
      var str = element.data;
      var found = 0;
      var match = str.match(regex);
      if (!match) {
        return;
      }
      found += match.length;
      str = str.replaceAll(regex, newWord);
      if (element.data && 3 === element.nodeType) {
        element.data = str;
      }
      return found;
    }

    /**
     * finds all word/texts within the main element (search area)
     * skips not allowed nodes.
     *
     * @param {*} element the parent-element within which to search
     * @param {*} regex the text to search for
     * @return {*}
     * @memberof TextHighlight
     */
  }, {
    key: "_find",
    value: function _find(element, regex) {
      if (!element || element.dataset['marked-' + this.rand] || this.settings.max && this._found >= this.settings.max) {
        return;
      }
      element = element.firstChild;
      while (null !== element && this._isNodesAllowed(element)) {
        if (3 === element.nodeType) {
          if (this._hasWord(element, regex)) {
            var found = this.fun(element, regex);
            // let found = this._markText(element, regex);
            this._found += found;
            // this.collection.push(element);
            var parent = element.parentElement;
            if (this.settings.highlightSection && !parent.classList.contains(this.settings.sectionClassName)) {
              parent.classList.add(this.settings.sectionClassName);
            }
          }
        } else {
          this._find(element, regex);
        }
        element = element.nextSibling;
      }
    }
  }, {
    key: "_createRegexFromInput",
    value: function _createRegexFromInput(input) {
      var regexMode = false;
      if (Array.isArray(input)) {
        // todo join only if minInput legth reached
        input = input.join('|');
      } else {
        input = input.toString();
        var firstInd = input.indexOf('/');
        var lastInd = input.lastIndexOf('/');
        if (firstInd >= 0 && lastInd > firstInd) {
          regexMode = true;
          var flagtmp = input.substr(lastInd + 1);
          input = input.substr(firstInd + 1, lastInd - 1);
          if (flagtmp.indexOf('i') >= 0) {
            this.settings.caseSensitive = false;
          } else {
            this.settings.caseSensitive = true;
          }
        } else {
          input = input.replace(/([()[{*+.$^\\|?])/g, '\\$1');
          if (this.settings.fullwordonly) {
            input = '\\b' + input + '\\b';
            this.settings.markwholeWord = false;
          }
          if (this.settings.markwholeWord) {
            input = '\\w*' + input + '\\w*';
          }
        }
        var len = input.length; //- (regexMode ? 2 : 0);

        if (len < this.settings.minInput || this.settings.maxInput && len > this.settings.maxInput || regexMode && input.length <= 2 && input.indexOf('.') >= 0) {
          return false;
        }
      }
      var flags = this.settings.caseSensitive ? 'g' : 'gi';
      var regex = new RegExp(input, flags);
      return regex;
    }

    /**
     * Contruct the regex for word searching
     *
     * @param {*} element the parent-element within which to search
     * @param {*} word the text to search for
     * @return {*}
     * @memberof TextHighlight
     */
  }, {
    key: "_start",
    value: function _start(element) {
      var word = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!element || null === word) {
        return;
      }
      var regex = this._createRegexFromInput(word);
      if (regex) {
        this._find(element, regex);
      } else {
        this.reset();
      }
    }

    /**
     * Update the word
     *
     * @param {*} word the text to search for
     * @memberof Highlighter
     */
  }, {
    key: "highlight",
    value: function highlight(word) {
      this.reset();
      if (!word || word === this.input) {
        return;
      }
      // store original input
      this.input = word;
      this.fun = this._markText;
      this._start(this.element, word);
    }

    /**
     * delete word
     *
     * @param {*} word
     * @memberof TextHighlight
     */
  }, {
    key: "delete",
    value: function _delete(word) {
      this.replace(word, '');
    }

    /**
     * replace word
     *
     * @param {*} word
     * @param {*} newWord
     * @return {*}
     * @memberof TextHighlight
     */
  }, {
    key: "replace",
    value: function replace(word, newWord) {
      var _this = this;
      if (!word || !newWord || word === this.input) {
        return;
      }

      // store original input
      this.input = word;
      this.fun = function (element, regex) {
        return _this._replaceText(element, regex, newWord);
      };
      this._start(this.element, word, newWord);
    }

    /**
     * Reset the highlighted elements
     *
     * @memberof Highlighter
     */
  }, {
    key: "reset",
    value: function reset() {
      var _this2 = this;
      this.element
      // .querySelectorAll('.' + this.settings.className)
      .querySelectorAll('[data-marked-' + this.rand + ']').forEach(function (el) {
        var parent = el.parentElement;
        var text;
        if (el.childNodes.length > 1) {
          text = el.innerText;
        } else {
          text = el.childNodes[0].data;
        }
        parent.replaceChild(document.createTextNode(text), el);
        parent.normalize();
      });
      if (this.settings.highlightSection) {
        this.element.querySelectorAll('.' + this.settings.sectionClassName).forEach(function (el) {
          el.classList.remove(_this2.settings.sectionClassName);
        });
      }
      this._found = 0;
    }

    /**
     * returns the number of found words
     *
     * @return {*} Number of found items within the main element (search area)
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
        this._start(this.element, word);
      }
    }
  }]);
  return TextHighlight;
}(); // default options
TextHighlight.defaults = {
  autoinit: true,
  word: null,
  replace: null,
  max: null,
  // max elements to highlight
  minInput: 2,
  // min input to trigger highlight
  maxInput: null,
  // max input to trigger highlight
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