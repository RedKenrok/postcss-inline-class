# PostCSS or

Post CSS plugin for simplifying or selectors (`,`). Instead of duplicating a selector for a few changes use the `or()` pseudo-class in your selector.

<table>
<tr><td>Before</td><td>After</td></tr>
<tr><td>

```CSS
button:or(:active, :focus, :hover) {
  [...]
}
```

</td><td>

```CSS
button:active,
button:focus,
button:hover {
  [...]
}
```

</td></tr>
</table>

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

- `{boolean} preserveWhitespace = false` Whether to preserve the whitespace in between the pseudo class options.
- `{string} pseudoClass = 'or'` The name of the at rule.

```JavaScript
plugins: [
  ['postcss-or', {
    preserveWhitespace: true,
    pseudoClass: 'any',
  }],
]
```

With `preserveWhite` set to `true`.

<table>
<tr><td>Before</td><td>Disabled</td><td>Enabled</td></tr>
<tr><td>

```CSS
.panel:any(.panel-border, .panel-content.panel-border) {
  [...]
}
```

</td><td>

```CSS
.panel.panel-border,
.panel.panel-content.panel-border {
  [...]
}
```

</td><td>

```CSS
.panel.panel-border,
.panel .panel-content.panel-border {
  [...]
}
```

</td></tr>
</table>

With `pseudoClass` set to `'any'`.

<table>
<tr><td>Before</td><td>After</td></tr>
<tr><td>

```CSS
button:any(:active, :focus, :hover) {
  [...]
}
```

</td><td>

```CSS
button:active,
button:focus,
button:hover {
  [...]
}
```

</td></tr>
</table>
