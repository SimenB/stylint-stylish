# stylint-stylish
> Stylish formatter for Stylint

[![NPM Version][npm-image]][npm-url]
[![Build Status][gh-actions-image]][gh-actions-url]
[![Coverage Status][coveralls-image]][coveralls-url]

## Screenshots
![This reporter][new-image]

vs original:

![Original reporter][orig-image]

## Usage

To use it, just set `reporter` to `stylint-stylish` in the config (`.stylintrc`) or when calling stylint programatically.

```json
{
  "reporter": "stylint-stylish",
  "noImportant": true,
  "semicolons": {
    "expect": "always",
    "error": true
  }
}
```

## Options
To use options, add a `reporterOptions`-object to the config

```json
{
  "reporter": "stylint-stylish",
  "reporterOptions": {
    "absolutePath": true
  },
  "noImportant": true,
  "semicolons": {
    "expect": "always",
    "error": true
  }
}
```

#### `verbose`
Type: `boolean`, default: `false`

When printing out a violation, print the full line with the violation as well.

#### `absolutePath`
Type: `boolean`, default: `false`

When printing out a filename, print the absolute path instead of a relative one

#### `ruleName`
Type: `boolean`, default: `false`

When printing out a violation, Include the name of the rule at the end


[gh-actions-url]: https://github.com/SimenB/stylint-stylish/actions
[gh-actions-image]: https://github.com/SimenB/stylint-stylish/actions/workflows/nodejs.yml/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/SimenB/stylint-stylish
[coveralls-image]: https://img.shields.io/coveralls/SimenB/stylint-stylish.svg
[npm-url]: https://npmjs.org/package/stylint-stylish
[npm-image]: https://img.shields.io/npm/v/stylint-stylish.svg
[new-image]: screenshots/this.png
[orig-image]: screenshots/original.png
