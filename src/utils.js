/**
 * Get leading whitespace of string
 * @param {string} string - Source string
 * @return {string} Leading whitespace string
 */
export function getLeadingSpace(string) {
  // Return everything before first non-whitespace character
  return string.substring(0, string.search(/\S/));
}

/**
 * Get trailing whitespace
 * @param {string} string - Source string
 * @return {string} Trailing whitespace string
 */
export function getTrailingSpace(string) {
  let trailingSpaceIndex = string.search(/\s+$/);
  // RegEx finds 1 or more consecutive spaces at the end of the string
  return trailingSpaceIndex > -1 ? string.substring(string.search(/\s+$/), string.length) : "";
}

/**
 * Wrap entire string in span and return HTML
 * @param {string} string - Plain text string
 * @return {string} Source string wrapped in HTML tag
 */
export function wrapString(string, options) {
  return `
    <${options.wrapEl} class="${options.className}">
      ${string}${options.append}
    </${options.wrapEl}>`;
}

/**
 * Wrap last X words of plain text string in HTML tag
 * @param {string} text - Plain text string
 * @return {string} String with last words wrapped in HTML tag
 */
export function wrapPlainTextWords(text, options) {
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
}
