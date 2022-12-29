# PostCSS or

Post CSS plugin for simplifying or selectors (`,`). Instead of duplicating a selector for a few changes use the `or()` pseudo-class in your selector.

```CSS
button:or(:active,:focus,:hover) {
  [...]
}
```

Will become.

```CSS
button:active,
button:focus,
button:hover {
  [...]
}
```

## Install

```
$ npm install postcss-or
```

## Usage

Add `postcss-or` to your list of postcss plugins.

```JavaScript
plugins: [
  'postcss-or',
]
```

## Options

The first parameters is an options object with the following values.

- `{String} pseudoClass = 'or'` The name of the at rule.

```JavaScript
plugins: [
  ['postcss-or', {
    pseudoClass: 'any',
  }],
]
```
