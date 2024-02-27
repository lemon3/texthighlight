/**
 * @jest-environment jsdom
 */

/* global afterEach, jest, describe, test, expect */

import TextHighlight from '../src/index.js';

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

describe('TextHighlight regex tests', () => {
  const th = new TextHighlight();

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
  const reset = () => {
    const text =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, dicta?';
    el.innerHTML = text;
    return el.childNodes[0];
  };

  textNode = reset();
  const count1 = th._markText(textNode, /si/gi);
  test('mark word "si" should return count of 2', () => expect(count1).toBe(2));

  textNode = reset();
  const count2 = th._markText(textNode, /lore/gi);
  test('mark word "lore" should return count of 2', () =>
    expect(count2).toBe(2));

  textNode = reset();
  const count3 = th._markText(textNode, /rumbum/gi);
  test('mark word "rumbum" should return count of 0', () =>
    expect(count3).toBe(0));
});

describe('text highlight test', () => {
  // Set up our document body
  const content = `
  <div id="test">
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt, nostrum!</p>
  </div>
`;
  document.body.innerHTML = content;
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
