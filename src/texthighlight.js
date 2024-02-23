/*!
 * author: wolfgang jungmayer
 * version: 0.1.0
 * (c) 2014 - 2024
 */

class TextHighlight {
  constructor(element, options) {
    if (!element) {
      element = document.body;
    }

    element =
      'string' === typeof element ? document.querySelector(element) : element;

    if (null === element || 0 === element.length) {
      return { error: true };
    }

    this.options = options || {}; // user options
    this.settings = Object.assign({}, TextHighlight.defaults, options);
    this.element = element;
    this._found = 0;

    this.rand = (Math.random() * 1000000) << 0;

    if (this.settings.autoinit) {
      this.init();
    }
  }

  notAllowedNodes = /script|textarea|input/;

  /**
   * check if given element contains the given input word
   *
   * @param {*} element the element within which to search
   * @param {*} regex the word to search for as regex
   * @return {*}  {boolean}
   * @memberof TextHighlight
   */
  _hasWord(element, regex) {
    const text = element.textContent;
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
  _isNodesAllowed(node) {
    const name = node.nodeName.toLowerCase();
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
  _markText(element, regex) {
    if (!element.data) {
      return;
    }

    const pa = element.parentNode;
    let result = '';
    let str = element.data;
    let marked = 0;

    while (str && null !== (result = regex.exec(str))) {
      let el = document.createElement('span');
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

  /**
   * finds all word/texts within the main element (search area)
   * skips not allowed nodes.
   *
   * @param {*} element the parent-element within which to search
   * @param {*} regex the text to search for
   * @return {*}
   * @memberof TextHighlight
   */
  _find(element, regex) {
    if (
      !element ||
      element.dataset['marked-' + this.rand] ||
      (this.settings.max && this._found >= this.settings.max)
    ) {
      return;
    }

    element = element.firstChild;
    while (null !== element && this._isNodesAllowed(element)) {
      if (3 === element.nodeType) {
        if (this._hasWord(element, regex)) {
          let found = this._markText(element, regex);
          this._found += found;
          // this.collection.push(element);
          let parent = element.parentElement;
          if (
            this.settings.highlightSection &&
            !parent.classList.contains(this.settings.sectionClassName)
          ) {
            parent.classList.add(this.settings.sectionClassName);
          }
        }
      } else {
        this._find(element, regex);
      }

      element = element.nextSibling;
    }
  }

  /**
   * Contruct the regex for word searching
   *
   * @param {*} element the parent-element within which to search
   * @param {*} word the text to search for
   * @return {*}
   * @memberof TextHighlight
   */
  _start(element, word) {
    if (!element || !word) {
      return;
    }

    if (Array.isArray(word)) {
      // todo join only if minInput legth reached
      word = word.join('|');
    } else {
      // todo test regexMode with regex ;)
      const regexMode = '/' === word[0] && '/' === word[word.length - 1];
      const len = word.length - (regexMode ? 2 : 0);

      if (regexMode) {
        word = word.substring(1, word.length - 1);
      } else {
        word = word.replace(/([()[{*+.$^\\|?])/g, '\\$1');

        if (this.settings.fullwordonly) {
          word = '\\b' + word + '\\b';
          this.settings.markwholeWord = false;
        }
        if (this.settings.markwholeWord) {
          word = '\\w*' + word + '\\w*';
        }
      }

      if (
        len < this.settings.minInput ||
        (this.settings.maxInput && len > this.settings.maxInput)
      ) {
        this.reset();
        return;
      }
    }

    let flags = this.settings.caseSensitive ? 'g' : 'gi';
    let regex = new RegExp(word, flags);

    // store original input
    this.input = word;
    this._find(element, regex);
  }

  /**
   * Update the word
   *
   * @param {*} word the text to search for
   * @memberof Highlighter
   */
  update(word) {
    // if (word === this.input) {
    //   return;
    // }
    this.reset();
    this._start(this.element, word);
  }

  /**
   * Reset the highlighted elements
   *
   * @memberof Highlighter
   */
  reset() {
    this.element
      .querySelectorAll('.' + this.settings.className)
      .forEach((el) => {
        const parent = el.parentElement;
        let text;
        if (el.childNodes.length > 1) {
          text = el.innerText;
        } else {
          text = el.childNodes[0].data;
        }
        parent.replaceChild(document.createTextNode(text), el);
        parent.normalize();
      });

    if (this.settings.highlightSection) {
      this.element
        .querySelectorAll('.' + this.settings.sectionClassName)
        .forEach((el) => {
          el.classList.remove(this.settings.sectionClassName);
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
  getCount() {
    return this._found;
  }

  /**
   * init function
   *
   * @return {*}
   * @memberof Highlighter
   */
  init() {
    if (this.initialized) {
      return true;
    }

    const word = this.settings.word;
    if (word) {
      this._start(this.element, word);
    }
  }
}

// default options
TextHighlight.defaults = {
  autoinit: true,
  word: null,
  max: null, // max elements to highlight
  minInput: 2, // min input to trigger highlight
  maxInput: null, // max input to trigger highlight
  caseSensitive: false,
  fullwordonly: false, // mark only if the full word is given
  markwholeWord: false, // mark the whole word (if a part is selected)
  className: 'highlight',
  highlightSection: false,
  sectionClassName: 'section-highlight',
};

export default TextHighlight;
