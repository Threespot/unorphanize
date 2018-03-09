import {getLeadingSpace, getTrailingSpace, wrapString, wrapPlainTextWords} from "../src/utils";
import Unorphanize from "../src/index";

test('getLeadingSpace', () => {
  expect(getLeadingSpace("  foo")).toBe("  ");
});


test('getTrailingSpace', () => {
  expect(getTrailingSpace("foo  ")).toBe("  ");
});

test('wrapString', () => {
  expect(wrapString("Hello", {
    wordCount: 2,
    wrapEl: "span",
    className: "u-nowrap",
    append: ""
  }).trim()).toBe(`<span class="u-nowrap">
      Hello
    </span>`);
});

test('wrapPlainTextWords', () => {
  expect(wrapPlainTextWords("One two three", {
    wordCount: 2,
    wrapEl: "span",
    className: "u-nowrap",
    append: ""
  }).trim()).toBe(`One
    <span class="u-nowrap">
      two three
    </span>`);

  expect(wrapPlainTextWords("One two three", {
    wordCount: 3,
    wrapEl: "span",
    className: "u-nowrap",
    append: ""
  }).trim()).toBe(`<span class="u-nowrap">
      One two three
    </span>`);
});

// Remove line breaks and consecutive spaces to make it easier to compare markup
function minify(string) {
	return string.replace(/\r?\n|\r/g,'').replace(/\s+/g,' ').trim()
}

const svgIcon = '<svg viewBox="0 0 207 365" preserveAspectRatio="xMidYMid meet" width="16" height="9"><path d="M0 340V25C0 3 26-8 42 7l158 158c9 10 9 25 0 35L42 358c-16 15-42 4-42-18z"></path></svg>';

test("Basic unorphanize examples", () => {

  document.body.innerHTML = `
    <p data-orphans>First second.</p>
    <p data-orphans><b>First</b> second.</p>
    <p data-orphans>First <b>second</b>.</p>
    <p data-orphans>First second <b>third</b>.</p>
    <p data-orphans>First second third fourth fifth sixth.</p>
    <p data-orphans>First second third fourth <b>fifth sixth</b>.</p>
    <p data-orphans>First second third <b>fourth fifth sixth</b>.</p>
    <p data-orphans>First second third <b>fourth</b> fifth sixth.</p>
    <p data-orphans>First second third fourth <b>fifth</b> sixth.</p>
    <p data-orphans>First second third fourth fifth <b>sixth</b>.</p>
    <p data-orphans>First second third <b>fourth</b> fifth <b>sixth</b>.</p>
    <p data-orphans>First second third fourth <b>fifth</b> <i>sixth</i>.</p>`;

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el);
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans="">
      <span class="u-nowrap">
        First second.
      </span></p>
    <p data-orphans="">
      <span class="u-nowrap">
        <b>First</b> second.
      </span></p>
    <p data-orphans="" class="u-nowrap">First <b>second</b>.</p>
    <p data-orphans="">First
      <span class="u-nowrap">
        second <b>third</b>.
      </span></p>
    <p data-orphans="">First second third fourth
      <span class="u-nowrap">
        fifth sixth.
      </span></p>
    <p data-orphans="">First second third fourth <b>
      <span class="u-nowrap">
        fifth sixth
      </span></b>.</p>
    <p data-orphans="">First second third <b>fourth
      <span class="u-nowrap">
        fifth sixth
      </span></b>.</p>
    <p data-orphans="">First second third <b>fourth</b>
      <span class="u-nowrap">
         fifth sixth.
      </span></p>
    <p data-orphans="">First second third fourth
      <span class="u-nowrap">
        <b>fifth</b> sixth.
      </span></p>
    <p data-orphans="">First second third fourth
      <span class="u-nowrap">
        fifth <b>sixth</b>.
      </span></p>
    <p data-orphans="">First second third <b>fourth</b>
      <span class="u-nowrap">
         fifth <b>sixth</b>.
      </span></p>
    <p data-orphans="">First second third fourth
      <span class="u-nowrap">
        <b>fifth</b> <i>sixth</i>.
      </span></p>`));
});

test("Test inline SVG icons", () => {

  document.body.innerHTML = `
    <p data-orphans>First second third fourth fifth sixth. ${svgIcon}</p>
    <p data-orphans>First second third <b>fourth</b> fifth sixth. ${svgIcon}</p>
    <p data-orphans>First second third fourth <b>fifth</b> sixth. ${svgIcon}</p>
    <p data-orphans>First second third fourth fifth <b>sixth.</b> ${svgIcon}</p>
    <p data-orphans>First second third <b>fourth</b> fifth <b>sixth.</b> ${svgIcon}</p>
    <p data-orphans>First second third fourth <b>fifth</b> <i>sixth.</i> ${svgIcon}</p>`;

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el);
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans="">First second third fourth fifth
      <span class="u-nowrap">
        sixth. ${svgIcon}
      </span></p>
      <p data-orphans="">First second third <b>fourth</b> fifth
      <span class="u-nowrap">
        sixth. ${svgIcon}
      </span></p>
      <p data-orphans="">First second third fourth <b>fifth</b>
      <span class="u-nowrap">
         sixth. ${svgIcon}
      </span></p>
      <p data-orphans="">First second third fourth fifth
      <span class="u-nowrap">
        <b>sixth.</b> ${svgIcon}
      </span></p>
      <p data-orphans="">First second third <b>fourth</b> fifth
      <span class="u-nowrap">
        <b>sixth.</b> ${svgIcon}
      </span></p>
      <p data-orphans="">First second third fourth <b>fifth</b>
      <span class="u-nowrap">
        <i>sixth.</i> ${svgIcon}
      </span></p>`));
});

test("Test appending SVG icon", () => {

  document.body.innerHTML = `
    <p data-orphans>First second third fourth fifth sixth.</p>
    <p data-orphans>First second third fourth <b>fifth sixth</b>.</p>
    <p data-orphans>First second third <b>fourth fifth sixth</b>.</p>
    <p data-orphans>First second third <b>fourth</b> fifth sixth.</p>
    <p data-orphans>First second third fourth <b>fifth</b> sixth.</p>
    <p data-orphans>First second third fourth fifth <b>sixth</b>.</p>
    <p data-orphans>First second third <b>fourth</b> fifth <b>sixth</b>.</p>
    <p data-orphans>First second third fourth <b>fifth</b> <i>sixth</i>.</p>`;

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el, {append: svgIcon});
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans="">First second third fourth fifth
      <span class="u-nowrap">
        sixth.${svgIcon}
      </span></p>
      <p data-orphans="">First second third fourth <b>fifth
      <span class="u-nowrap">
        sixth${svgIcon}
      </span></b>.</p>
      <p data-orphans="">First second third <b>fourth fifth
      <span class="u-nowrap">
        sixth${svgIcon}
      </span></b>.</p>
      <p data-orphans="">First second third <b>fourth</b> fifth
      <span class="u-nowrap">
        sixth.${svgIcon}
      </span></p>
      <p data-orphans="">First second third fourth <b>fifth</b>
      <span class="u-nowrap">
         sixth.${svgIcon}
      </span></p>
      <p data-orphans="">First second third fourth fifth <b>
      <span class="u-nowrap">
        sixth${svgIcon}
      </span></b>.</p>
      <p data-orphans="">First second third <b>fourth</b> fifth <b>
      <span class="u-nowrap">
        sixth${svgIcon}
      </span></b>.</p>
      <p data-orphans="">First second third fourth <b>fifth</b> <i>
      <span class="u-nowrap">
        sixth${svgIcon}
      </span></i>.</p>`));
});

test("Test appending SVG icon to another SVG", () => {

  document.body.innerHTML = `<p data-orphans>${svgIcon}</p>`

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el, {append: svgIcon});
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans=""> <span class="u-nowrap"> ${svgIcon}${svgIcon} </span></p>`));
});

test("Custom word count", () => {

  document.body.innerHTML = `
    <p data-orphans="3">First second third.</p>
    <p data-orphans="3">First <b>second third</b>.</p>
    <p data-orphans="3"><b>First second third</b>.</p>
    <p data-orphans="3">First second <b>third</b>.</p>
    <p data-orphans="3">First second third fourth fifth sixth.</p>
    <p data-orphans="3">First second third fourth <b>fifth sixth</b>.</p>
    <p data-orphans="3">First second third <b>fourth fifth sixth</b>.</p>
    <p data-orphans="3">First second third <b>fourth</b> fifth sixth.</p>
    <p data-orphans="3">First second third fourth <b>fifth</b> sixth.</p>
    <p data-orphans="3">First second third fourth fifth <b>sixth</b>.</p>
    <p data-orphans="3">First second third <b>fourth</b> fifth <b>sixth</b>.</p>
    <p data-orphans="3">First second third <b>fourth fifth</b> sixth.</p>
    <p data-orphans="3">First second third <b>fourth fifth</b> <i>sixth</i>.</p>
    <p data-orphans="3">First second third <b>fourth</b> <i>fifth sixth</i>.</p>`;

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el, {wordCount: 3});
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans="3">
      <span class="u-nowrap">
        First second third.
      </span></p>
    <p data-orphans="3" class="u-nowrap">First <b>second third</b>.</p>
    <p data-orphans="3"><b>
      <span class="u-nowrap">
        First second third
      </span></b>.</p>
    <p data-orphans="3" class="u-nowrap">First second <b>third</b>.</p>
    <p data-orphans="3">First second third
      <span class="u-nowrap">
        fourth fifth sixth.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        fourth <b>fifth sixth</b>.
      </span></p>
      <p data-orphans="3">First second third <b>
      <span class="u-nowrap">
        fourth fifth sixth
      </span></b>.</p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        <b>fourth</b> fifth sixth.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        fourth <b>fifth</b> sixth.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        fourth fifth <b>sixth</b>.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        <b>fourth</b> fifth <b>sixth</b>.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        <b>fourth fifth</b> sixth.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        <b>fourth fifth</b> <i>sixth</i>.
      </span></p>
      <p data-orphans="3">First second third
      <span class="u-nowrap">
        <b>fourth</b> <i>fifth sixth</i>.
      </span></p>`));
});

test("Examples that can’t be updated", () => {

  document.body.innerHTML = `
    <p data-orphans>   </p>
    <p data-orphans>First</p>
    <p data-orphans>First second third <b>fourth fifth</b> sixth.</p>
    <p data-orphans>First second third <b>fourth fifth</b> <i>sixth</i>.</p>
    <p data-orphans>First second third fourth <b>fifth sixth.</b> ${svgIcon}</p>
    <p data-orphans>First second third <b>fourth fifth sixth.</b> ${svgIcon}</p>`;

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el);
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans="">   </p>
    <p data-orphans="">First</p>
    <p data-orphans="">First second third <b>fourth fifth</b> sixth.</p>
    <p data-orphans="">First second third <b>fourth fifth</b> <i>sixth</i>.</p>
    <p data-orphans="">First second third fourth <b>fifth sixth.</b> ${svgIcon}</p>
    <p data-orphans="">First second third <b>fourth fifth sixth.</b> ${svgIcon}</p>`));
});

test("Invalid wordCount values", () => {

  document.body.innerHTML = `
    <p data-orphans>First second third fourth fifth sixth.</p>
    <p data-orphans>First second third fourth <b>fifth sixth</b>.</p>
    <p data-orphans>First second third <b>fourth fifth sixth</b>.</p>`;

  const nodes = document.querySelectorAll("[data-orphans]");

  nodes.forEach(function(el) {
    var u = new Unorphanize(el, {wordCount: "foo"});
  });

  expect(minify(document.body.innerHTML)).toBe(minify(`
    <p data-orphans="">First second third fourth
      <span class="u-nowrap">
        fifth sixth.
      </span></p>
    <p data-orphans="">First second third fourth <b>
      <span class="u-nowrap">
        fifth sixth
      </span></b>.</p>
    <p data-orphans="">First second third <b>fourth
      <span class="u-nowrap">
        fifth sixth
      </span></b>.</p>`));
});

test("exit early", () => {
  expect(() => {
    new Unorphanize()
  }).toThrowError();
});
