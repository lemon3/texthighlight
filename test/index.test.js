/**
 * @jest-environment jsdom
 */

/* global afterEach, jest, describe, test, expect */

import TextHighlight from '../src/index.js';

// Set up our document body
const resetDOM = () => {
  const content = `
    <div id="test">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt, nostrum sor!
    </div>
  `;
  document.body.innerHTML = content;
};
resetDOM();

afterEach(() => {
  jest.clearAllMocks();
  // only for spyOn mocked Equivalent to .mockRestore()
  // jest.restoreAllMocks();
});

describe('TextHighlight Class tests', () => {
  test('TextHighlight is Object', () => {
    expect(TextHighlight).toBeTruthy();
    expect(typeof TextHighlight).toBe('function');
  });

  test('new TextHighlight() is Object', () => {
    const bp = new TextHighlight();
    expect(bp).toBeTruthy();
    expect(typeof bp).toBe('object');
  });

  test('TextHighlight.defaults -> is Object', () => {
    expect(TextHighlight.defaults).toBeTruthy();
    expect(typeof TextHighlight.defaults).toBe('object');
  });
});

describe('TextHighlight initialize', () => {
  test('init with no element should use body', () => {
    const options = {};
    const th = new TextHighlight(null, options);
    expect(th.element).toBe(document.body);
  });

  test('init with none existend element', () => {
    const options = {};
    const th = new TextHighlight('#fake', options);
    expect(th).toEqual({ error: true });
  });

  test('init wrong option type', () => {
    const options = 'fake';
    const th = new TextHighlight(null, options);
    expect(th).toEqual({ error: true });
  });
});

describe('TextHighlight regex tests', () => {
  const th = new TextHighlight(null, {
    maxInput: 8,
    minInput: 2,
  });

  const testing = [
    {
      in: 'hello',
      out: /hello/gi,
    },
    {
      in: /hello/,
      out: /hello/g,
    },
    {
      in: /hello/g,
      out: /hello/g,
    },
    {
      in: /hello/i,
      out: /hello/gi,
    },
    {
      in: /hello/gi,
      out: /hello/gi,
    },
    {
      in: '/hello',
      out: /\/hello/gi,
    },
    {
      in: 'h',
      out: false,
    },
    {
      in: 'hhhhhhhhhh',
      out: false,
    },
    {
      in: '/.*/',
      out: false,
    },
  ];

  testing.forEach((t) => {
    test('input: "' + t.in + '" should be "' + t.out + '"', () => {
      const result = th._createRegexFromInput(t.in);
      expect(result).toEqual(t.out);
    });
  });
});

describe('test _hasWord', () => {
  const th = new TextHighlight();

  const el = document.createElement('span');
  el.innerHTML =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
  const el2 = document.createElement('span');

  test('word "ips" is in text', () =>
    expect(th._hasWord(el, /ips/gi)).toBe(true));

  test('word "rom" is not in text', () =>
    expect(th._hasWord(el, /rom/gi)).toBe(false));

  test('no element given, should return false', () =>
    expect(th._hasWord(null, /rom/gi)).toBe(false));

  test('fake element given, should return false', () =>
    expect(th._hasWord('fake', /ips/gi)).toBe(false));

  test('no regex given, should return false', () =>
    expect(th._hasWord(el, null)).toBe(false));

  test('no regex given, should return false', () =>
    expect(th._hasWord(el, 'met')).toBe(true));

  test('empty dom element should return false', () =>
    expect(th._hasWord(el2, 'met')).toBe(false));
});

describe('test _find', () => {
  const el = document.createElement('span');
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
  el.innerHTML = text;
  const th = new TextHighlight(el);

  test('no element or regex given, should return false', () => {
    expect(th._find()).toBe(false);
  });

  test('no element given, should return false', () => {
    expect(th._find(null, /lor/gi)).toBe(false);
  });

  test('element and regex given, should return count', () => {
    const regex = /sit/gi;
    const match = text.match(regex);
    expect(th._find(el, regex)).toBe(match.length);
  });
});

describe('test _isNodesAllowed', () => {
  const th = new TextHighlight();
  let nodes = 'script|textarea|input';
  nodes = nodes.split('|');

  nodes.forEach((node) => {
    const n = document.createElement(node);
    test('node "' + node + '" is not allowed', () =>
      expect(th._isNodesAllowed(n)).toBe(false)
    );
  });
});

describe('test _markText', () => {
  const th = new TextHighlight();
  const el = document.createElement('span');
  let textNode;
  const reset = (clear) => {
    const text = clear
      ? ''
      : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
    el.innerHTML = text;
    return el.childNodes[0];
  };

  test('empty textnode given, should return count of 0', () => {
    textNode = reset(true);
    const count = th._markText(textNode, /si/gi);
    expect(count).toBe(0);
  });

  test('last word in text replaced, should use parent appendChild', () => {
    textNode = reset();
    const count = th._markText(textNode, /dicta\?/gi);
    expect(count).toBe(1);
    expect(el.childNodes.length).toBe(3);
  });

  test('mark word "si" should return count of 2', () => {
    textNode = reset();
    const count1 = th._markText(textNode, /si/gi);
    expect(count1).toBe(2);
  });

  test('mark word "lore" should return count of 2', () => {
    textNode = reset();
    const count2 = th._markText(textNode, /lore/gi);
    expect(count2).toBe(2);
  });

  test('mark word "rumbum" should return count of 0', () => {
    textNode = reset();
    const count3 = th._markText(textNode, /rumbum/gi);
    expect(count3).toBe(0);
  });
});

describe('test highlight(word)', () => {
  const el = document.createElement('span');
  const th = new TextHighlight(el);
  const reset = (clear) => {
    const text = clear
      ? ''
      : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
    el.innerHTML = text;
    return el.childNodes[0];
  };

  test('word given', () => {
    reset();
    const that = th.highlight('amet');
    expect(that).toBe(th);
  });

  test('no word given', () => {
    reset();
    const that = th.highlight();
    expect(that).toBe(false);
  });
});

describe('test delete(word)', () => {
  const el = document.createElement('span');
  const th = new TextHighlight(el);
  const reset = (clear) => {
    const text = clear
      ? ''
      : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
    el.innerHTML = text;
    return el.childNodes[0];
  };

  test('word given', () => {
    reset();
    const that = th.delete('amet');
    expect(that).toBe(th);
  });

  test('no word given', () => {
    reset();
    const that = th.delete();
    expect(that).toBe(false);
  });
});

describe('test reset()', () => {
  const el = document.createElement('span');
  const th = new TextHighlight(el, {
    highlightSection: true,
  });
  const reset = (text = '') => {
    text =
      '' !== text
        ? text
        : 'Lorem ipsum dolor blumbum sit amet consectetur adipisicing elit. Dolorem, dicta?';
    el.innerHTML = text;
  };

  test('first highlight a word', () => {
    reset();
    th.highlight('ipsum');
    expect(th.getCount()).toBe(1);
  });

  test('now use reset, no highlighted word should be found', () => {
    th.reset();
    expect(th.getCount()).toBe(0);
    const highlighted = el.querySelectorAll(th.settings.className);
    expect(highlighted.length).toBe(0);
  });

  const newInnerHtml =
    '<span>Lorem ipsum</span> blumbum sit amet consectetur <span>adipisicing</span> elit. Dolorem, dicta?';
  test('first highlight a word', () => {
    reset(newInnerHtml);
    th.highlight('adipisi');
    expect(th.getCount()).toBe(1);
  });

  test('now use reset, no highlighted word should be found', () => {
    th.reset();
    expect(th.getCount()).toBe(0);
    const highlighted = el.querySelectorAll(th.settings.className);
    expect(highlighted.length).toBe(0);
  });
});

describe('test _replaceText', () => {
  const th = new TextHighlight();
  const el = document.createElement('span');
  let textNode;
  const reset = (clear) => {
    const text = clear
      ? ''
      : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
    el.innerHTML = text;
    return el.childNodes[0];
  };

  test('replace word "si" should return count of 2', () => {
    textNode = reset();
    const count1 = th._replaceText(textNode, /si/gi, 'is');
    expect(count1).toBe(2);
  });

  test('element should contain new word xxx 2 times', () => {
    textNode = reset();
    th._replaceText(textNode, /si/gi, 'xxx');
    const match = el.innerHTML.match(/xxx/g);
    expect(match.length).toBe(2);
  });

  test('new text length should be correct', () => {
    textNode = reset();
    const textLen = el.innerHTML.length;
    const word = 'lorem';
    const wordLen = word.length;
    const count = th._replaceText(textNode, new RegExp(word, 'gi'), '');

    const shouldBe = textLen - count * wordLen;
    const len = el.innerHTML.length;
    expect(len).toBe(shouldBe);
  });

  test('empty textnode given, should return 0 as count', () => {
    textNode = reset(true);
    const count = th._replaceText(textNode, /aaa/gi, '');
    expect(count).toBe(0);
  });

  test('no match should return 0 as count', () => {
    textNode = reset();
    const count = th._replaceText(textNode, /nomatch/gi, '');
    expect(count).toBe(0);
  });

  test('no replacement word given, should use ""', () => {
    textNode = reset();
    const textLen = el.innerHTML.length;
    const word = 'lorem';
    const wordLen = word.length;
    const count = th._replaceText(textNode, new RegExp(word, 'gi'));

    const shouldBe = textLen - count * wordLen;
    const len = el.innerHTML.length;
    expect(len).toBe(shouldBe);
  });
});

describe('test _start', () => {
  const th = new TextHighlight();

  test('no element given shold return false', () => {
    const result = th._start(null);
    expect(result).toBe(false);
  });

  test('no word to find given, should return false', () => {
    const el = document.querySelector('#test');
    const result = th._start(el);
    expect(result).toBe(false);
  });

  test('element and word given', () => {
    const el = document.querySelector('#test');
    const result = th._start(el, 'lor');
    expect(result).toBe(undefined);
  });
});

describe('option testing', () => {
  describe('testing autoinit', () => {
    const options = {
      autoinit: true,
    };
    const element = document.querySelector('#test');
    const th = new TextHighlight(element, options);
    test('autoinit: true, should set initialized to true', () => {
      expect(th.initialized).toBe(true);
    });

    test('if allready initialized, should return instance', () => {
      expect(th.init()).toBe(th);
      expect(th instanceof TextHighlight).toBe(true);
    });

    test('autoinit: false, should not set initialized', () => {
      const th2 = new TextHighlight(null, {
        autoinit: false,
      });
      expect(th2.initialized).not.toBeTruthy();
    });
  });

  describe('testing max', () => {
    test('only the first 2 found words should be markes', () => {
      resetDOM();
      const options = {
        max: 2,
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      th.highlight('or');
      const count = th.getCount();
      expect(count).toBe(2);
    });
  });

  describe('testing the section highlight', () => {
    test('parent element should contain section classname', () => {
      resetDOM();
      const options = {
        word: 'ipsum',
        highlightSection: true,
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      expect(element.classList.toString()).toBe(th.settings.sectionClassName);
    });
  });

  describe('testing maxInput', () => {
    test('no element should be highlighted if input < 2', () => {
      resetDOM();
      const options = {
        maxInput: 4,
        word: 'pweqwe',
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      const highlighted = element.querySelectorAll('.' + th.settings.className);
      expect(highlighted.length).toBe(0);
    });
  });

  describe('testing minInput', () => {
    test('no element should be highlighted if input < 2', () => {
      resetDOM();
      const options = {
        word: 'p',
        minInput: 2,
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      const highlighted = element.querySelectorAll('.' + th.settings.className);
      expect(highlighted.length).toBe(0);
    });
  });

  describe('testing fullwordonly', () => {
    test('only a part of the word is used, do not highlight', () => {
      resetDOM();
      const options = {
        fullwordonly: true,
        word: 'lor',
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      const highlighted = element.querySelectorAll('.' + th.settings.className);
      expect(highlighted.length).toBe(0);
    });

    test('complete word is used, highlight it', () => {
      resetDOM();
      const options = {
        fullwordonly: true,
        word: 'lorem',
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      const highlighted = element.querySelectorAll('.' + th.settings.className);
      expect(highlighted.length).toBe(1);
    });
  });

  describe('testing markwholeWord', () => {
    test('mark the complete word if a part is selected', () => {
      resetDOM();
      const options = {
        markwholeWord: true,
        word: 'ore',
      };
      const element = document.querySelector('#test');
      const th = new TextHighlight(element, options);
      const highlighted = element.querySelectorAll('.' + th.settings.className);
      expect(highlighted.length).toBe(1);
      highlighted.forEach((el) => {
        expect(el.innerHTML.length).toBe('lorem'.length);
      });
    });
  });
});

describe('text highlight test', () => {
  const element = document.querySelector('#test');
  const options = {
    className: 'hl',
  };
  const th = new TextHighlight(element, options);
  th.highlight('it');

  test('two elements should be wrapped', () => {
    expect(th.getCount()).toEqual(2);
  });

  test('two wrapped elements should be found', () => {
    const hls = element.querySelectorAll('.hl');
    expect(hls.length).toEqual(2);
  });
});
