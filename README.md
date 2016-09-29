# stylint-stylish
> Stylish formatter for Stylint

[![NPM Version][npm-image]][npm-url]
[![Linux build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Codeclimate Status][codeclimate-image]][codeclimate-url]

[![bitHound Dependencies][bithound-image]][bithound-url]
[![Dependency Status][david-image]][david-url]
[![Dev Dependency Status][david-dev-image]][david-dev-url]
[![Peer Dependency Status][david-peer-image]][david-peer-url]

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


[travis-url]: https://travis-ci.org/SimenB/stylint-stylish
[travis-image]: https://img.shields.io/travis/SimenB/stylint-stylish.svg
[appveyor-url]: https://ci.appveyor.com/project/SimenB/stylint-stylish
[appveyor-image]: https://ci.appveyor.com/api/projects/status/53xeie72m3yejs4c?svg=true
[coveralls-url]: https://coveralls.io/github/SimenB/stylint-stylish
[coveralls-image]: https://img.shields.io/coveralls/SimenB/stylint-stylish.svg
[codeclimate-url]: https://codeclimate.com/github/SimenB/stylint-stylish
[codeclimate-image]: https://img.shields.io/codeclimate/github/SimenB/stylint-stylish.svg
[npm-url]: https://npmjs.org/package/stylint-stylish
[npm-image]: https://img.shields.io/npm/v/stylint-stylish.svg
[bithound-url]: https://www.bithound.io/github/SimenB/stylint-stylish/master/dependencies/npm
[bithound-image]: https://www.bithound.io/github/SimenB/stylint-stylish/badges/dependencies.svg
[david-url]: https://david-dm.org/SimenB/stylint-stylish
[david-image]: https://img.shields.io/david/SimenB/stylint-stylish.svg
[david-dev-url]: https://david-dm.org/SimenB/stylint-stylish#info=devDependencies
[david-dev-image]: https://img.shields.io/david/dev/SimenB/stylint-stylish.svg
[david-peer-url]: https://david-dm.org/SimenB/stylint-stylish#info=peerDependencies
[david-peer-image]: https://img.shields.io/david/peer/SimenB/stylint-stylish.svg
[new-image]: screenshots/this.png
[orig-image]: screenshots/original.png
