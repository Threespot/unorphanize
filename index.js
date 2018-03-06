"use strict";

/**
 * Get leading whitespace of string
 * @param {string} string - Source string
 * @return {string} Leading whitespace string
 */
const getLeadingSpace = function(string) {
  // Return everything before first non-whitespace character
  return string.substring(0, string.search(/\S/));
};

/**
 * Get trailing whitespace
 * @param {string} string - Source string
 * @return {string} Trailing whitespace string
 */
const getTrailingSpace = function(string) {
  let trailingSpaceIndex = string.search(/\s+$/);
  // RegEx finds 1 or more consecutive spaces at the end of the string
  return trailingSpaceIndex > -1 ? string.substring(string.search(/\s+$/), string.length) : "";
};

/**
 * Wrap entire string in span and return HTML
 * @param {string} string - Plain text string
 * @return {string} Source string wrapped in HTML tag
 */
const wrapSring = function(string) {
  return `
    <${options.wrapEl} class="${options.className}">
      ${string}${options.append}
    </${options.wrapEl}>`;
};

/**
 * Wrap last X words of plain text string in HTML tag
 * @param {string} text - Plain text string
 * @return {string} String with last words wrapped in HTML tag
 */
const wrapPlainTextWords = function(text, options) {
  // Create word array
  // (trim text to avoid counting leading/trailing spaces)
  let allWords = text.trim().split(" ");

  // Return original text if not enough words to wrap
  if (allWords.length < options.wordCount) {
    return text;
  }

  // Find the last X words that should not wrap
  let lastWords = allWords.splice(
    allWords.length - options.wordCount,
    options.wordCount
  );

  // Add back leading/trailing space
  let startString = getLeadingSpace(text) + allWords.join(" ");
  let endString = lastWords.join(" ") + getTrailingSpace(text);

  return `${startString}
    <${options.wrapEl} class="${options.className}">
      ${endString}${options.append}
    </${options.wrapEl}>`;
};

/**
 * Wrap the last X words in an HTML tag to prevent them from wrapping (i.e. orphans)
 * @param {HTMLElement} text - Plain text string
 * @param {Object} opts - Options
 * @param {number} [opts.wordCount=2] - Minimum number of words required to wrap to a new line
 * @param {string} [opts.wrapEl=span] - Tag name to use for the wrapper element
 * @param {string} [opts.className=u-nowrap] - Class name to apply to wrapper element
 * @param {string} [opts.append] - Any arbitrary string or HTML to append inside of the wrapper element
 */
class Unorphanize {
  constructor(el, opts) {
    this.el = el;
    this.origText = this.el.textContent;
    this.childNodes = this.el.children;

    // Use Object.assign() to merge “options” object with default values object
    this.options = Object.assign(
      {},
      {
        wordCount: 2, // accepts any integer
        wrapEl: "span", // accepts any tag name
        className: "u-nowrap", // accepts any valid class name
        append: "" // accepts any arbitrary HTML
      },
      opts
    );

    // Convert to integer
    this.options.wordCount = parseInt(this.options.wordCount, 10);

    // Default to 2 if non-integer valu was passed
    if (isNaN(this.options.wordCount)) {
      this.options.wordCount = 2;
    }

    // Subtract 1 of an “append” string was passed
    if (this.options.append.length) {
      this.options.wordCount -= 1;
    }

    // Exit if no text
    // Note: textContent is better than innerText
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#Differences_from_innerText
    if (this.origText.length === 0) {
      return false;
    }

    // If no children, use simple method that doesn’t account for child nodes
    if (this.childNodes.length === 0) {
      // Update target element with new HTML
      this.el.innerHTML = wrapPlainTextWords(this.origText, this.options);
      // console.log("No children \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
      return false;
    }

    // If there are child nodes use more advanced logic
    wrapRichText();
  }

/**
 * Parse child node text and adjacent strings, update variables
 * @param {HTMLElement} childEl - Child node
 */
  updateChildNodeVars() {
    this.childHtml = this.childEl.outerHTML;

    // Use split to find text before and after the child
    this.currentChildSplit = this.el.innerHTML.split(this.childHtml);
    this.textBeforeChild = this.currentChildSplit[0];
    this.textAfterChild = this.currentChildSplit[1] || "";

    // For every child after the first, we don’t want to re-count the words
    // from the previous child and any text to the right of it. We determine
    // where this is by searching for the first “<” character.
    this.markupIndex = this.textAfterChild.indexOf("<");

    // Get just the text after the child, but before any previously evaluated children.
    this.plainText = this.markupIndex > -1 ? this.textAfterChild.substring(0, this.markupIndex) : this.textAfterChild;

    // Save the previously evaluated markup to add back later
    this.previousString = this.markupIndex > -1 ? this.textAfterChild.substring(markupIndex) : "";

    // Count words in child node (if no text, count as 1 word, e.g. svg or img tag)
    this.childWordCount = this.childEl.textContent.length ? this.childEl.textContent.trim().split(" ").length : 1;

    // Convert plain text to array, fallback to null if no text
    // Note: A string of whitespce returns 1 for this.plainText.trim().split(" "),
    //       so check the trimmed length and set to null if it’s all whitespce.
    this.plainTextWords = this.plainText.trim().length ? this.plainText.trim().split(" ") : null;

    // Count words after child, not including previously evaluated text
    this.plainTextWordCount = this.plainTextWords !== null ? this.plainTextWords.length : 0;

    // If the plain text doesn’t start with a space, treat the first words as part of the child element’s last word.
    this.partialWord = "";

    if (this.plainTextWordCount > 0 && this.plainText.search(/\S/) === 0) {
      // Save partial word string, remove from plainTextWords array
      this.partialWord = this.plainTextWords.shift();
      // Subtract 1 from plain text word count
      this.plainTextWordCount--;
    }
  }

  // Check if child and any previously evaluated text have enough words to wrap
  formatChildOnly() {
    if (this.childWordCount + this.previousWordCount >= this.options.wordCount) {
      if (this.previousWordCount === 0) {
        // Child has enough words by itself, so we can wrap its inner text
        this.childEl.innerHTML = wrapPlainTextWords(this.childEl.textContent, this.options);
        // console.log("Last child has enough words \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
      else if (this.childWordCount + this.previousWordCount === this.options.wordCount) {
        // If the child’s words plus the previous words are exactly enough, wrap both.
        this.el.innerHTML = this.textBeforeChild + wrapSring(this.childHtml + this.textAfterChild);
        // console.log("Last child and previous text have exactly enough words \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
      else if (this.childWordCount + this.previousWordCount > this.options.wordCount) {
        console.warn("Can’t safely prevent orphans on this element \n", el);
        return false;
      }
    }
    else {
      // Increment this.previousWordCount and continue with for loop
      // console.log("Child has too few words, increment this.previousWordCount by", this.childWordCount);
      this.previousWordCount += this.childWordCount;
    }
  }

  // Format text before the first child
  formatTextBeforeFirstChild() {
    // After all the children have been evaluated, check for text before the first child.
    let elInnerHTML = this.el.innerHTML;
    let firstChildIndex = elInnerHTML.indexOf("<");
    this.textBeforeChild = firstChildIndex > -1 ? elInnerHTML.substring(0, firstChildIndex) : elInnerHTML;

    // Save the previously evaluated string to add back later
    let stringAfterText = firstChildIndex > -1 ? elInnerHTML.substring(firstChildIndex) : "";

    if (textBeforeChild.trim().length > 0) {
      let words = this.textBeforeChild.trim().split(" ");

      if (words.length + this.previousWordCount === this.options.wordCount) {
        // Prevent entire element from wrapping
        this.el.classList.add(this.options.className);
        // console.log("Text and children exactly equal word count \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
      else if (words.length + this.previousWordCount >= this.options.wordCount) {
        // Get number of additional words needed
        let wordsNeeded = this.options.wordCount - this.previousWordCount;

        // Split string into two parts
        let leftoverText = getLeadingSpace(textBeforeChild) + words.splice(0, words.length - wordsNeeded).join(" ");
        let textToWrap = words.join(" ") + getTrailingSpace(textBeforeChild);

        // Update target element HTML
        this.el.innerHTML = leftoverText + wrapSring(textToWrap + stringAfterText);
        // console.log("Text and string have more than enough words \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
    }
  }

  // In order to avoid using complex RegEx to parse HTML (see links below),
  // we’re looping through each child element. The steps are as follows:
  //
  // - Check for any text to the right of the current child element.
  // - If there is text, see how many words there are.
  // - Check if the first word has a leading space. If not, consider it part
  //   of the previous child element and don’t include in word count.
  // - If there are at least this.options.wordCount words, use wrapPlainTextWords() on the text.
  // - If there are not enough words, check the child element’s text.
  // - If the child has no space after it, consider its last word as part
  //   of the first plain text word to the right, so subtract 1 from word count.
  // - If the child has exactly enough words, wrap the child and the text
  //   to the right using wrapSring().
  // - If the child has too many words, we can’t safely break it up to wrap just the
  //   desired number of words. Exit and do nothing.
  // - If the child doesn’t have enough words, move on to the next child.
  // - If all children have been checked and we still don’t have enough words,
  //   check for any text to the left of the first child.
  // - If the left text has exactly enough words, add a class of this.options.className (i.e. “u-nowrap”)
  // - If the left text has too many words, figure out how many we need and wrap along
  //   with the text to the right using wrapSring().
  // - If the left text doens’t have enough words, exit and do nothing.
  //
  // Why we’re not using RegEx:
  // https://blog.codinghorror.com/parsing-html-the-cthulhu-way/
  // https://stackoverflow.com/a/1732454/673457
  wrapRichText() {
    // Keep track of the number of “words” (includes tags with no text, like SVG)
    // so we can tell if it’s safe to wrap plain text and child elements together.
    // For example: `foo <b>bar.</b>` or `<b>foo</b> bar.`
    this.previousWordCount = 0;

    for (var i = this.childNodes.length; i > 0; i--) {
      this.childEl = this.childNodes[i - 1];

      // Update node text and adjacent string variables
      this.updateChildNodeVars();

      // If no plain text, only check the child’s text
      if (this.plainTextWordCount === 0) {
        this.formatChildOnly();
      }
      // Text and previous string have exactly enough words
      else if (this.plainTextWordCount + this.previousWordCount === this.options.wordCount) {
        // Update target element HTML
        this.el.innerHTML = this.textBeforeChild + this.childHtml + wrapSring(this.plainText + this.previousString);
        // console.log("Text and previous string have exactly enough words \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
      // Text and previous string have more than enough words
      else if (this.plainTextWordCount + this.previousWordCount > this.options.wordCount) {
        // Get number of additional words needed
        let wordsNeeded = this.options.wordCount - this.previousWordCount;

        // Split string into two parts, add back leading/trailing space
        let leftoverText = getLeadingSpace(this.plainText) + this.plainTextWords.splice(0, this.plainTextWordCount - wordsNeeded).join(" ");
        let textToWrap = this.plainTextWords.join(" ") + getTrailingSpace(this.plainText);

        // Update target element HTML
        this.el.innerHTML = this.textBeforeChild + this.childHtml + leftoverText + wrapSring(textToWrap + this.previousString);
        // console.log("Text and string have more than enough words \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
      // Child words plus text and previous string have exactly enough words
      else if (this.childWordCount + this.plainTextWordCount + this.previousWordCount === this.options.wordCount) {
        // Update target element HTML
        this.el.innerHTML = this.textBeforeChild + wrapSring(this.childHtml + this.plainText + this.previousString);
        // console.log("Child words plus text plus previous text have exactly enough words \n", this.el.outerHTML.replace(/\r?\n|\r/g," "));
        return false;
      }
      // Child words plus text and previous string have more than enough words
      else if (this.childWordCount + this.plainTextWordCount + this.previousWordCount > this.options.wordCount) {
        console.warn("Can’t safely prevent orphans on this element \n", el);
        return false;
      }
      else {
        // Increment this.previousWordCount and continue with for loop
        this.previousWordCount += this.childWordCount+ this.plainTextWordCount;
        // console.log("Increment word count to ", this.previousWordCount);
      }
    }

    // If we still don’t have enough words to wrap, check for any text before the first child
    this.formatTextBeforeFirstChild();
  }

}

export default Unorphanize;
