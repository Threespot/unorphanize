(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["unorphanizeLink"] = factory();
	else
		root["unorphanizeLink"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Wrap the last X words in an HTML tag to prevent them from wrapping (i.e. orphans)\n * @param {HTMLElement} text - Plain text string\n * @param {Object} opts - Options\n * @param {number} [opts.wordCount=2] - Minimum number of words required to wrap to a new line\n * @param {string} [opts.wrapEl=span] - Tag name to use for the wrapper element\n * @param {string} [opts.className=u-nowrap] - Class name to apply to wrapper element\n * @param {string} [opts.append] - Any arbitrary string or HTML to append inside of the wrapper element\n */\nvar Unorphanize = function () {\n  function Unorphanize(el, opts) {\n    _classCallCheck(this, Unorphanize);\n\n    this.el = el;\n\n    try {\n      // Note: Using textContent instead of innerText avoids a reflow but includes text hidden by CSS.\n      // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#Differences_from_innerText\n      this.origText = this.el.textContent;\n      this.childNodes = this.el.children;\n    } catch (e) {\n      throw Error('Unorphanize: Constructor requires a DOM node object');\n    }\n\n    // Exit if el is undefined or has no content\n    if (el.innerHTML.trim().length === 0) {\n      console.warn('Unorphanize: Element contains no text or child nodes');\n    }\n\n    // Use Object.assign() to merge “options” object with default values object\n    this.options = Object.assign({}, {\n      wordCount: 2, // accepts any integer\n      wrapEl: \"span\", // accepts any tag name\n      className: \"u-nowrap\", // accepts any valid class name\n      append: \"\" // accepts any arbitrary HTML\n    }, opts);\n\n    // Convert to integer\n    this.options.wordCount = parseInt(this.options.wordCount, 10);\n\n    // Default to 2 if non-integer value was passed\n    if (isNaN(this.options.wordCount)) {\n      this.options.wordCount = 2;\n    }\n\n    // Subtract 1 of an “append” string was passed\n    if (this.options.append.length) {\n      this.options.wordCount -= 1;\n    }\n\n    // If no children, use simple method that doesn’t account for child nodes\n    if (this.childNodes.length === 0) {\n      // Update target element with new HTML\n      this.el.innerHTML = (0, _utils.wrapPlainTextWords)(this.origText, this.options);\n      // console.log(\"No children \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n    } else {\n      // If there are child nodes, we must use more advanced logic\n      this.wrapRichText();\n    }\n  }\n\n  /**\n   * Parse child node text and adjacent strings, update variables\n   * @param {HTMLElement} childEl - Child node\n   */\n\n\n  _createClass(Unorphanize, [{\n    key: \"updateChildNodeVars\",\n    value: function updateChildNodeVars() {\n      this.childHtml = this.childEl.outerHTML;\n\n      // Use split to find text before and after the child\n      this.currentChildSplit = this.el.innerHTML.split(this.childHtml);\n      this.textBeforeChild = this.currentChildSplit[0];\n      this.textAfterChild = this.currentChildSplit[1] || \"\";\n\n      // For every child after the first, we don’t want to re-count the words\n      // from the previous child and any text to the right of it. We determine\n      // where this is by searching for the first “<” character.\n      this.markupIndex = this.textAfterChild.indexOf(\"<\");\n\n      // Get just the text after the child, but before any previously evaluated children.\n      this.plainText = this.markupIndex > -1 ? this.textAfterChild.substring(0, this.markupIndex) : this.textAfterChild;\n\n      // Save the previously evaluated markup to add back later\n      this.previousString = this.markupIndex > -1 ? this.textAfterChild.substring(this.markupIndex) : \"\";\n\n      // Save the child node text\n      this.childText = this.childEl.textContent;\n\n      // Count words in child node (if no text, count as 1 word, e.g. svg or img tag)\n      this.childWordCount = this.childText.length ? this.childText.trim().split(\" \").length : 1;\n\n      // Convert plain text to array, fallback to null if no text\n      // Note: A string of whitespce returns 1 for this.plainText.trim().split(\" \"),\n      //       so check the trimmed length and set to null if it’s all whitespce.\n      this.plainTextWords = this.plainText.trim().length ? this.plainText.trim().split(\" \") : null;\n\n      // Count words after child, not including previously evaluated text\n      this.plainTextWordCount = this.plainTextWords !== null ? this.plainTextWords.length : 0;\n\n      // If the plain text doesn’t start with a space, treat the first words as part of the child element’s last word.\n      this.partialWord = \"\";\n\n      if (this.plainTextWordCount > 0 && this.plainText.search(/\\S/) === 0) {\n        // Save partial word string, remove from plainTextWords array\n        this.partialWord = this.plainTextWords.shift();\n        // Subtract 1 from plain text word count\n        this.plainTextWordCount--;\n      }\n    }\n\n    // Format text before the first child\n\n  }, {\n    key: \"formatTextBeforeFirstChild\",\n    value: function formatTextBeforeFirstChild() {\n      // After all the children have been evaluated, check for text before the first child.\n      var elInnerHTML = this.el.innerHTML;\n      var firstChildIndex = elInnerHTML.indexOf(\"<\");\n      this.textBeforeChild = firstChildIndex > -1 ? elInnerHTML.substring(0, firstChildIndex) : elInnerHTML;\n\n      // Save the previously evaluated string to add back later\n      var stringAfterText = firstChildIndex > -1 ? elInnerHTML.substring(firstChildIndex) : \"\";\n\n      if (this.textBeforeChild.trim().length > 0) {\n        var words = this.textBeforeChild.trim().split(\" \");\n\n        if (words.length + this.previousWordCount === this.options.wordCount) {\n          // Prevent entire element from wrapping\n          this.el.classList.add(this.options.className);\n          // console.log(\"Text and children exactly equal word count \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n          return true;\n        } else if (words.length + this.previousWordCount >= this.options.wordCount) {\n          // Get number of additional words needed\n          var wordsNeeded = this.options.wordCount - this.previousWordCount;\n\n          // Split string into two parts\n          var leftoverText = (0, _utils.getLeadingSpace)(this.textBeforeChild) + words.splice(0, words.length - wordsNeeded).join(\" \");\n          var textToWrap = words.join(\" \") + (0, _utils.getTrailingSpace)(this.textBeforeChild);\n\n          // Update target element HTML\n          this.el.innerHTML = leftoverText + (0, _utils.wrapString)(textToWrap + stringAfterText, this.options);\n          // console.log(\"Text and string have more than enough words \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n          return true;\n        }\n      }\n    }\n\n    // In order to avoid using complex RegEx to parse HTML (see links below),\n    // we’re looping through each child element. The steps are as follows:\n    //\n    // - Check for any text to the right of the current child element.\n    // - If there is text, see how many words there are.\n    // - Check if the first word has a leading space. If not, consider it part\n    //   of the previous child element and don’t include in word count.\n    // - If there are at least this.options.wordCount words, use wrapPlainTextWords() on the text.\n    // - If there are not enough words, check the child element’s text.\n    // - If the child has no space after it, consider its last word as part\n    //   of the first plain text word to the right, so subtract 1 from word count.\n    // - If the child has exactly enough words, wrap the child and the text\n    //   to the right using wrapString().\n    // - If the child has too many words, we can’t safely break it up to wrap just the\n    //   desired number of words. Exit and do nothing.\n    // - If the child doesn’t have enough words, move on to the next child.\n    // - If all children have been checked and we still don’t have enough words,\n    //   check for any text to the left of the first child.\n    // - If the left text has exactly enough words, add a class of this.options.className (i.e. “u-nowrap”)\n    // - If the left text has too many words, figure out how many we need and wrap along\n    //   with the text to the right using wrapString().\n    // - If the left text doens’t have enough words, exit and do nothing.\n    //\n    // Why we’re not using RegEx:\n    // https://blog.codinghorror.com/parsing-html-the-cthulhu-way/\n    // https://stackoverflow.com/a/1732454/673457\n\n  }, {\n    key: \"wrapRichText\",\n    value: function wrapRichText() {\n      // Keep track of the number of “words” (includes tags with no text, like SVG)\n      // so we can tell if it’s safe to wrap plain text and child elements together.\n      // For example: `foo <b>bar.</b>` or `<b>foo</b> bar.`\n      this.previousWordCount = 0;\n\n      for (var i = this.childNodes.length; i > 0; i--) {\n        this.childEl = this.childNodes[i - 1];\n\n        // Update node text and adjacent string variables\n        this.updateChildNodeVars();\n\n        // If no plain text, only check the child’s text\n        //------------------------------------------------------------------------\n        if (this.plainTextWordCount === 0) {\n          if (this.childWordCount + this.previousWordCount >= this.options.wordCount) {\n            if (this.previousWordCount === 0) {\n              // If child has no text, wrap it (e.g. an svg/img that we’re appending content to)\n              if (!this.childText.length) {\n                this.childEl.outerHTML = (0, _utils.wrapString)(this.childEl.outerHTML, this.options);\n              } else {\n                // Child has enough words by itself, so we can wrap its inner text\n                this.childEl.innerHTML = (0, _utils.wrapPlainTextWords)(this.childEl.textContent, this.options);\n              }\n              // console.log(\"Last child has enough words \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n              return true;\n            } else if (this.childWordCount + this.previousWordCount === this.options.wordCount) {\n              // If the child’s words plus the previous words are exactly enough, wrap both.\n              this.el.innerHTML = this.textBeforeChild + (0, _utils.wrapString)(this.childHtml + this.textAfterChild, this.options);\n              // console.log(\"Last child and previous text have exactly enough words \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n              return true;\n            } else if (this.childWordCount + this.previousWordCount > this.options.wordCount) {\n              console.warn(\"Unorphanize: Can’t safely prevent orphans on this element \\n\", this.el);\n              return true;\n            }\n          } else {\n            // Increment this.previousWordCount and continue with for loop\n            // console.log(\"Child has too few words, increment this.previousWordCount by\", this.childWordCount);\n            this.previousWordCount += this.childWordCount;\n          }\n        }\n        // Text and previous string have exactly enough words\n        //------------------------------------------------------------------------\n        else if (this.plainTextWordCount + this.previousWordCount === this.options.wordCount) {\n            // Update target element HTML\n            this.el.innerHTML = this.textBeforeChild + this.childHtml + (0, _utils.wrapString)(this.plainText + this.previousString, this.options);\n            // console.log(\"Text and previous string have exactly enough words \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n            return true;\n          }\n          // Text and previous string have more than enough words\n          //------------------------------------------------------------------------\n          else if (this.plainTextWordCount + this.previousWordCount > this.options.wordCount) {\n              // Get number of additional words needed\n              var wordsNeeded = this.options.wordCount - this.previousWordCount;\n\n              // Split string into two parts, add back leading/trailing space\n              var leftoverText = (0, _utils.getLeadingSpace)(this.plainText) + this.plainTextWords.splice(0, this.plainTextWordCount - wordsNeeded).join(\" \");\n              var textToWrap = this.plainTextWords.join(\" \") + (0, _utils.getTrailingSpace)(this.plainText);\n\n              // Update target element HTML\n              this.el.innerHTML = this.textBeforeChild + this.childHtml + leftoverText + (0, _utils.wrapString)(textToWrap + this.previousString, this.options);\n              // console.log(\"Text and string have more than enough words \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n              return true;\n            }\n            // Child words plus text and previous string have exactly enough words\n            //------------------------------------------------------------------------\n            else if (this.childWordCount + this.plainTextWordCount + this.previousWordCount === this.options.wordCount) {\n                // Update target element HTML\n                this.el.innerHTML = this.textBeforeChild + (0, _utils.wrapString)(this.childHtml + this.plainText + this.previousString, this.options);\n                // console.log(\"Child words plus text plus previous text have exactly enough words \\n\", this.el.outerHTML.replace(/\\r?\\n|\\r/g,\" \"));\n                return true;\n              }\n              // Child words plus text and previous string have more than enough words\n              //------------------------------------------------------------------------\n              else if (this.childWordCount + this.plainTextWordCount + this.previousWordCount > this.options.wordCount) {\n                  console.warn(\"Unorphanize: Can’t safely prevent orphans on this element \\n\", this.el);\n                  return true;\n                } else {\n                  // Increment this.previousWordCount and continue with for loop\n                  this.previousWordCount += this.childWordCount + this.plainTextWordCount;\n                  // console.log(\"Increment word count to \", this.previousWordCount);\n                }\n      }\n\n      // If we still don’t have enough words to wrap, check for any text before the first child\n      this.formatTextBeforeFirstChild();\n    }\n  }]);\n\n  return Unorphanize;\n}();\n\nexports.default = Unorphanize;\n\n//# sourceURL=webpack://%5Bname%5DLink/./src/index.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.getLeadingSpace = getLeadingSpace;\nexports.getTrailingSpace = getTrailingSpace;\nexports.wrapString = wrapString;\nexports.wrapPlainTextWords = wrapPlainTextWords;\n/**\n * Get leading whitespace of string\n * @param {string} string - Source string\n * @return {string} Leading whitespace string\n */\nfunction getLeadingSpace(string) {\n  // Return everything before first non-whitespace character\n  return string.substring(0, string.search(/\\S/));\n}\n\n/**\n * Get trailing whitespace\n * @param {string} string - Source string\n * @return {string} Trailing whitespace string\n */\nfunction getTrailingSpace(string) {\n  var trailingSpaceIndex = string.search(/\\s+$/);\n  // RegEx finds 1 or more consecutive spaces at the end of the string\n  return trailingSpaceIndex > -1 ? string.substring(string.search(/\\s+$/), string.length) : \"\";\n}\n\n/**\n * Wrap entire string in span and return HTML\n * @param {string} string - Plain text string\n * @return {string} Source string wrapped in HTML tag\n */\nfunction wrapString(string, options) {\n  return \"\\n    <\" + options.wrapEl + \" class=\\\"\" + options.className + \"\\\">\\n      \" + string + options.append + \"\\n    </\" + options.wrapEl + \">\";\n}\n\n/**\n * Wrap last X words of plain text string in HTML tag\n * @param {string} text - Plain text string\n * @return {string} String with last words wrapped in HTML tag\n */\nfunction wrapPlainTextWords(text, options) {\n  // Create word array\n  // (trim text to avoid counting leading/trailing spaces)\n  var allWords = text.trim().split(\" \");\n\n  // Return original text if not enough words to wrap\n  if (allWords.length < options.wordCount) {\n    return text;\n  }\n\n  // Find the last X words that should not wrap\n  var lastWords = allWords.splice(allWords.length - options.wordCount, options.wordCount);\n\n  // Add back leading/trailing space\n  var startString = getLeadingSpace(text) + allWords.join(\" \");\n  var endString = lastWords.join(\" \") + getTrailingSpace(text);\n\n  return startString + \"\\n    <\" + options.wrapEl + \" class=\\\"\" + options.className + \"\\\">\\n      \" + endString + options.append + \"\\n    </\" + options.wrapEl + \">\";\n}\n\n//# sourceURL=webpack://%5Bname%5DLink/./src/utils.js?");

/***/ })

/******/ });
});
//# sourceMappingURL=unorphanize.umd.js.map