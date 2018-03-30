# Unorphanize
[![npm](https://badge.fury.io/js/%40threespot%2Funorphanize.svg)](https://www.npmjs.com/package/@threespot/unorphanize)
[![Build Status](https://travis-ci.org/Threespot/unorphanize.svg?branch=master)](https://travis-ci.org/Threespot/unorphanize)
[![Coverage Status](https://coveralls.io/repos/github/Threespot/unorphanize/badge.svg)](https://coveralls.io/github/Threespot/unorphanize)

Helper function to wrap the last X words in an HTML tag to prevent them from wrapping.

**Caveats**
- This script doesn’t check if text is visible (possible future enhancement)
- Using this inside of links or headings could cause issues in VoiceOver on iOS
  - See http://axesslab.com/text-splitting/ for solutions

## Install

```bash
yarn add @threespot/unorphanize
```

## Usage

```js
// ES6 module
import Unorphanize from "@threespot/unorphanize";

// For transpiled ES5 code, import this file:
// import Unorphanize from "@threespot/unorphanize/dist/unorphanize.m";

const nodes = document.querySelectorAll("[data-orphans]");

nodes.forEach(function(el) {
  var u = new Unorphanize(el, {
    wordCount: 2, // number of words to prevent wrapping [default: 2]
    wrapEl: "span", // wrapper element tag [default: "span"]
    inlineStyles: true, // Add “white-space: nowrap;” to elements as inline style [default: true]
    className: "custom-class", // Custom class to add to wrapper [default: ""]
    append: "" // HTML to append to wrapper [default: ""]
  });
});
```

**Example:**

```html
<p data-orphans>First second third fourth <b>fifth</b> <i>sixth</i>.</p>
```

**Becomes:**

```html
<p data-orphans>First second third fourth <span class="custom-class" style="white-space: nowrap !important;"><b>fifth</b> <i>sixth</i>.</span></p>
```

---

To support setting `wordCount` in the HTML, you could do something like this:

```js
import Unorphanize from "@threespot/unorphanize";

const nodes = document.querySelectorAll("[data-orphans]");

nodes.forEach(function(el) {
  const options = {};

  // Check for custom word count
  const wordCount = el.getAttribute("data-orphans");

  // Set custom word count if defined (defaults to 2)
  if (wordCount) {
    options.wordCount = wordCount;
  }

  var u = new Unorphanize(el, options);
});

```
**Example:**

```html
<p data-orphans="3">First second third fourth fifth sixth.</p>
```

**Becomes:**

```html
<p data-orphans="3">First second third <span style="white-space: nowrap !important;">fourth fifth sixth.</span></p>
```

---

We recommend using a **custom class** instead of inline styles to allow wrapping in small viewports.

```js
const nodes = document.querySelectorAll("[data-orphans]");

nodes.forEach(function(el) {
  var u = new Unorphanize(el, {
    inlineStyles: false,
    className: "nowrap"
  });
});
```

**Example CSS**

```css
@media all and (min-width: 320px) {
  .nowrap {
    white-space: nowrap !important;
  }
}
```

**Example HTML:**

```html
<p data-orphans>First second third fourth.</p>
```

**Becomes:**

```html
<p data-orphans>First second <span class="nowrap">third fourth.</span></p>
```

## License

Unorphanize is free software and may be redistributed under the terms of the [MIT license](https://github.com/Threespot/unorphanize/blob/master/LICENSE.md).

## About Threespot

Threespot is an independent digital agency hell-bent on helping those, and only those, who are committed to helping others. Find out more at [https://www.threespot.com](https://www.threespot.com).

[![Threespot](https://avatars3.githubusercontent.com/u/370822?v=3&s=100)](https://www.threespot.com)
