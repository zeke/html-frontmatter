# HTML Frontmatter

Extract key-value metadata from HTML comments

In the world of printed books, [front
matter](http://en.wikipedia.org/wiki/Book_design#Front_matter) is the stuff
at the beginning of the book like the title page, foreword, preface, table
of contents, etc. In the world of computer programming, frontmatter is metadata at the top
of a file. The term was (probably) popularized by the [Jekyll static site
generator](http://jekyllrb.com/docs/frontmatter/).

Unlike YAML frontmatter though, HTML frontmatter lives inside plain old HTML comments, so it will be
quietly ignored by tools/browsers that don't know about it.

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install html-frontmatter --save
```

## Usage

Given an HTML or Markdown file that looks like this:

```html
<!--
title: GitHub Integration
keywords: github, git, npm, enterprise
published: 2014-10-02
description: npmE works with GitHub!
-->

<h1>Hello World</h1>
```

And code like this:

```js
var fm = require("html-frontmatter")
var frontmatter = fm(fs.readFileSync("github.md").toString())
```

Here's what you'll get:

```js
{
  title: "GitHub integration",
  keywords: "github, git, enterprise",
  published: "2014-10-02"
}
```

### Multiline Values

If you have a long string (like a description) and want it to span multiple
lines, simply indent each subsequent line with *2 or more* spaces:

```html
<!--
description: This is a long string that
  wraps and goes on forever
  and wraps some more
-->
```

### Colons in Values

Your values can contain colons. No worries.

```html
<!--
title: How I roll: or, the life of a wheel
-->
```

## Tests

```sh
npm install
npm test

# ✓ extracts metadata from colon-delimited comments at the top of an HTML string
# ✓ returns null if frontmatter is not found
# ✓ handles values that contain colons
# ✓ handles line-wrapped values
# ✓ cleans up excess whitespace
# ✓ ignores comments that are not at the top of the file
```
