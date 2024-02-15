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

    if (this.settings.autoinit) {
      this.init();
    }
  }

  _wrapWords(element, word = this.word) {
    const text = (element.innerText || element.textContent).trim();
    if (!text.length) {
      return;
    }

    const wrapStart = `<span class="${this.settings.className}">`;
    const wrapEnd = '</span>';
    let result = '';
    let match;

    // no limit
    if (!this.settings.max) {
      match = text.match(word);
      if (!match) {
        return;
      }
      this._found += match.length;
      result = text.replaceAll(word, `${wrapStart}$&${wrapEnd}`);
    } else {
      let indStart = 0;
      let indEnd = 0;

      for (const m of text.matchAll(word)) {
        indEnd = m.index + m[0].length;
        result += text
          .substring(indStart, indEnd)
          .replace(m[0], wrapStart + m[0] + wrapEnd);
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

      result += text.substring(indEnd);
    }

    console.log(element);
    if (element.append) {
      element.innerHTML = '\n'+ result;
    } else {
      // must be wrapped
      const span = document.createElement('span');
      span.innerHTML = '\n' + result + '\n';
      element.parentNode.replaceChild(span, element);

      element = span;
    }

    return element;
  }

  _hasWord = (text, regex = this.word) => text.match(regex);

  _childNodesAllowed(node) {
    let ignore = true;
    const name = node.nodeName.toLowerCase();
    if ('script' === name || 'textarea' === name) {
      ignore = false;
    }
    return ignore;
  }

  _hlSection(element) {
    const text = (element.innerText || element.textContent).trim();
    if (
      '' === text ||
      (this.settings.max && this._found >= this.settings.max)
    ) {
      return;
    }

    const children = element.childNodes;

    if (
      ((1 === element.nodeType && 0 === element.children.length) ||
        0 === children.length) &&
      this._hasWord(text)
    ) {
      const el = this._wrapWords(element);
      // this.collection.push(element);
      if (
        this.settings.highlightSection &&
        !el.classList.contains(this.settings.sectionClassName)
      ) {
        el.classList.add(this.settings.sectionClassName);
      }
      return;
    }

    children.forEach((child) => {
      if (this._childNodesAllowed(child)) {
        this._hlSection(child);
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
  _hl(word, element = this.element) {
    if (!word) {
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

      if (len < this.settings.minInput) {
        this.reset();
        return;
      }
    }

    let flags = this.settings.caseSensitive ? 'g' : 'gi';
    this.word = new RegExp(word, flags);

    this._hlSection(element, this.word);
  }

  /**
   * Update the word
   *
   * @param {*} word
   * @memberof Highlighter
   */
  update(word) {
    this.reset();
    this._hl(word);
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
        if (el.parentElement) {
          const text = el.parentElement.innerText;
          el.parentElement.innerText = text;
        }
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
   * @return {*}
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
      this._hl(word);
    }
  }
}

// default options
TextHighlight.defaults = {
  autoinit: true,
  word: null,
  max: 100, // max elements to highlight
  minInput: 2, // min input to trigger highlight
  caseSensitive: false,
  fullwordonly: false, // mark only if the full word is given
  markwholeWord: false, // mark the whole word (if a part is selected)
  className: 'highlight',
  highlightSection: false,
  sectionClassName: 'section-highlight',
};

export default TextHighlight;
