# Unorphanize
[![npm](https://img.shields.io/npm/v/@threespot/unorphanize.svg)](https://www.npmjs.com/package/@threespot/unorphanize)
[![Build Status](https://travis-ci.org/Threespot/unorphanize.svg?branch=master)](https://travis-ci.org/Threespot/unorphanize)
[![Coverage Status](https://coveralls.io/repos/github/Threespot/unorphanize/badge.svg)](https://coveralls.io/github/Threespot/unorphanize)

Helper function to wrap the last X words in an HTML tag to prevent them from wrapping.

NOTE: Text hidden by CSS will be treated the same as visible text.

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
    wordCount: 2, // accepts any integer
    wrapEl: "span", // accepts any tag name
    className: "u-nowrap", // accepts any valid class name
    append: "" // accepts any arbitrary HTML
  });
});
```

**Example:**

```html
<p data-orphans>First second third fourth <b>fifth</b> <i>sixth</i>.</p>
```

**Becomes:**

```html
<p data-orphans>First second third fourth <span class="u-nowrap"><b>fifth</b> <i>sixth</i>.</span></p>
```

---

To support passing `wordCount` in the HTML, you could do something like this:

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
<p data-orphans="3">First second third <span class="u-nowrap">fourth fifth sixth.</span></p>
```

## License

Unorphanize is free software and may be redistributed under the terms of the [MIT license](https://github.com/Threespot/frontline-sass/blob/master/LICENSE.md).

## About Threespot

Threespot is an independent digital agency hell-bent on helping those, and only those, who are committed to helping others. Find out more at [https://www.threespot.com](https://www.threespot.com).

[![Threespot](https://avatars3.githubusercontent.com/u/370822?v=3&s=100)](https://www.threespot.com)
