# TextHighlight
## demo
[texthighlight demo >]([https://](https://lemon3.github.io/texthighlight/))

## usage
default usage:
```js
const elementToSearch = document.body;
const search = 'lorem';
const thl = new TextHighlight(elementToSearch, search);
```
with options, and custom search element
```js
const options = {
  search: 'met',
  markwholeWord: true, // mark the whole word (if a part is selected)
  className: 'highlight2', // to style the highlight word
};

// only search within this element (#myElement)
const myElement = document.querySelector(myElement, options);
const thl = new TextHighlight(myElement, options);
```
## options
```js
const options = {
  autoinit: true,
  search: null,
  max: null, // max elements to highlight
  minInput: 2, // min input to trigger highlight
  maxInput: null, // max input to trigger highlight
  caseSensitive: false,
  fullwordonly: false, // mark only if the full word is given
  markwholeWord: false, // mark the whole word (if a part is selected)
  className: 'highlight', // class name for styling the highlighted word
  highlightSection: false, // also highlight wrapping element
  sectionClassName: 'section-highlight', // class name for wrapping element
}
```
