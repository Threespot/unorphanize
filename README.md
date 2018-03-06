# Unorphanize

[![Build Status](https://travis-ci.org/Threespot/unorphanize.svg?branch=master)](https://travis-ci.org/Threespot/unorphanize) [![Coverage Status](https://coveralls.io/repos/github/Threespot/unorphanize/badge.svg)](https://coveralls.io/github/Threespot/unorphanize)

Helper function to wrap the last X words in an HTML tag to prevent them from wrapping.

## Install

```bash
yarn add @threespot/unorphanize
```

## Usage

```js
import unorphanize from "@threespot/unorphanize";

var nodes = document.querySelectorAll('[data-orphans]');

nodes.forEach(function(el) {
  unorphanize(el, {
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

To support passing `wordCount` in the HTML, you could do something like this:

```js
import unorphanize from './unorphanize';

class Orphans {
  constructor(el) {
    this.options = {};

    // Check for custom word count (unorphanize will handle validation)
    this.wordCount = el.getAttribute("data-orphans");

    if (this.wordCount) {
      this.options.wordCount = this.wordCount;
    }

    unorphanize(el, this.options);
  }
}

const nodes = document.querySelectorAll("[data-orphans]");

nodes.forEach(function(el) {
  var o = new Orphans(el);
});
```
**Example:**

```html
<p data-orphans="3">First second third fourth fifth sixth.</p>
```

**Becomes:**

```html
<p data-orphans>First second third <span class="u-nowrap">fourth fifth sixth.</span></p>
```

## License

Unorphanize is free software and may be redistributed under the terms of the [MIT license](https://github.com/Threespot/frontline-sass/blob/master/LICENSE.md).

## About Threespot

Threespot is an independent digital agency hell-bent on helping those, and only those, who are committed to helping others. Find out more at [https://www.threespot.com](https://www.threespot.com).

[![Threespot](https://avatars3.githubusercontent.com/u/370822?v=3&s=100)](https://www.threespot.com)
