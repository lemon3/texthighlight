class TextHighlight {
  constructor(element, options) {
    if (!element) {
      element = document.body;
    } else if ('string' === typeof element) {
      element = document.querySelector(element);
    }

    if (
      null === element ||
      0 === element.length ||
      (options && 'object' !== typeof options)
    ) {
      return { error: true };
    }

    this.options = options || {}; // user options
    this.settings = Object.assign({}, TextHighlight.defaults, options);
    this.element = element;

    this._found = 0;
    this._rand = (Math.random() * 1000000) << 0;
    this.fun = this._markText;

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
    if (
      !element ||
      !element.textContent ||
      !element.textContent.trim() ||
      null === regex ||
      '' === regex
    ) {
      return false;
    }
    const text = element.textContent;
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
  _markText(textNode, regex) {
    if (!textNode || 'undefined' === typeof textNode.data) {
      return 0;
    }

    let str = textNode.data;
    const pa = textNode.parentNode;
    let result = '';
    let marked = 0;

    while (str && null !== (result = regex.exec(str))) {
      if (this.settings.max && marked >= this.settings.max) {
        return marked;
      }

      let el = document.createElement('span');
      el.className = this.settings.className;

      el.appendChild(document.createTextNode(result[0]));
      textNode.replaceData(result.index, result[0].length, '');
      textNode = textNode.splitText(result.index);
      marked++;
      str = textNode.data;

      // mark as beeing used
      el.dataset['marked-' + this._rand] = true;

      // if (pa) {
      if (str) {
        pa.insertBefore(el, textNode);
      } else {
        pa.appendChild(el);
        break;
      }
      // }
    }

    return marked;
  }

  _replaceText(textNode, regex, newWord) {
    if (!textNode || 'undefined' === typeof textNode.data) {
      return 0;
    }

    let str = textNode.data;
    let found = 0;
    let match = str.match(regex);

    if (!match) {
      return 0;
    }
    found += match.length;

    if ('undefined' === typeof newWord) {
      newWord = '';
    }

    str = str.replaceAll(regex, newWord);
    textNode.data = str;

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
  _find(element, regex) {
    // console.log(this.settings.max, this._found, this.settings.max);
    if (!element || element.dataset['marked-' + this._rand]) {
      return false;
    }

    element = element.firstChild;
    while (
      null !== element &&
      this._isNodesAllowed(element) &&
      (!this.settings.max || this._found < this.settings.max)
    ) {
      if (3 === element.nodeType) {
        if (this._hasWord(element, regex)) {
          let found = this.fun(element, regex);
          this._found += found;
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

    return this._found;
  }

  _createRegexFromInput(input) {
    let regexMode = false;

    // if (Array.isArray(input)) {
    //   // todo join only if minInput legth reached
    //   input = input.join('|');
    // } else {

    input = input.toString();

    let firstInd = input.indexOf('/');
    let lastInd = input.lastIndexOf('/');

    if (firstInd >= 0 && lastInd > firstInd) {
      regexMode = true;
      let flagtmp = input.substr(lastInd + 1);
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

    const len = input.length; //- (regexMode ? 2 : 0);

    if (
      len < this.settings.minInput ||
      (this.settings.maxInput && len > this.settings.maxInput) ||
      (regexMode && input.length <= 2 && input.indexOf('.') >= 0)
    ) {
      return false;
    }
    // }

    let flags = this.settings.caseSensitive ? 'g' : 'gi';
    let regex = new RegExp(input, flags);

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
  _start(element, word = null) {
    if (!element || null === word) {
      return false;
    }

    const regex = this._createRegexFromInput(word);
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
  highlight(word) {
    this.reset();
    if (!word || word === this._lastInput) {
      return false;
    }
    // store original input
    this._lastInput = word;

    this.fun = this._markText;
    this._start(this.element, word);
    return this;
  }

  /**
   * delete word
   *
   * @param {*} word
   * @memberof TextHighlight
   */
  delete(word) {
    return this.replace(word, '');
  }

  /**
   * replace word
   *
   * @param {*} word
   * @param {*} newWord
   * @return {*}
   * @memberof TextHighlight
   */
  replace(word, newWord) {
    if (!word || 'string' !== typeof newWord || word === this._lastInput) {
      return false;
    }

    // store original input
    this._lastInput = word;

    this.fun = (element, regex) => this._replaceText(element, regex, newWord);
    this._start(this.element, word, newWord);
    return this;
  }

  /**
   * Reset the highlighted elements
   *
   * @memberof Highlighter
   */
  reset() {
    this.element
      // .querySelectorAll('.' + this.settings.className)
      .querySelectorAll('[data-marked-' + this._rand + ']')
      .forEach((el) => {
        const parent = el.parentElement;
        let text;
        // if (el.childNodes.length > 1) {
        //   text = el.innerText;
        // } else {
        text = el.childNodes[0].data;
        // }
        parent.replaceChild(document.createTextNode(text), el);
        parent.normalize();
      });

    if (this.settings.highlightSection) {
      if (this.element.classList.contains(this.settings.sectionClassName)) {
        this.element.classList.remove(this.settings.sectionClassName);
      }

      this.element
        .querySelectorAll('.' + this.settings.sectionClassName)
        .forEach((el) => {
          el.classList.remove(this.settings.sectionClassName);
        });
    }

    this._lastInput = null;
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
      return this;
    }
    this.initialized = true;

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
  replace: null,
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
