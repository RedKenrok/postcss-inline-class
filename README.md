# PostCSS re-use

Re-use rules by inlining other previously declared rules' content using postcss.

## Install

```
$ npm install postcss-reuse
```

## Usage

Add `postcss-reuse` to your list of postcss plugins.

```JavaScript
plugins: [
  'postcss-reuse',
]
```

## Options

The first parameters is an options object with the following values.

- `{String} atRuleName = 'reuse'` The name of the at rule.

```JavaScript
plugins: [
  ['postcss-reuse', { atRuleName: '@inline' }],
]
```

## Examples

### Basic

<table>
<tr><td>Before</td><td>After</td></tr>
<tr><td>

```CSS
.a {
  color: red;
}

.b {
  @reuse .a;
  font-size: 14px;
}
```

</td><td>

```CSS
.a {
  color: red;
}

.b {
  color: red;
  font-size: 14px;
}
```

</td></tr>
</table>

### Multiple blocks

<table>
<tr><td>Before</td><td>After</td></tr>
<tr><td>

```CSS
.a {
  color: red;
}

.a, .b {
  font-size: 14px
}

.c {
  @reuse .a;
}
```

</td><td>

```CSS
.a {
  color: red;
}

.a, .b {
  font-size: 14px
}

.c {
  color: red;
  font-size: 14px;
}
```

</td></tr>
</table>

### Nested

<table>
<tr><td>Before</td><td>After</td></tr>
<tr><td>

```CSS
.foo + div.a {
  color: red;
}

.b {
  @reuse .a;
  font-size: 14px;
}
```

</td><td>

```CSS
.foo + div.a {
  color: red;
}

.b {
  font-size: 14px;
}

.foo + div.b {
  color: red;
}
```

</td></tr>
</table>

### Media queries

<table>
<tr><td>Before</td><td>After</td></tr>
<tr><td>

```CSS
.a {
  color: red;
}

@media (min-width: 240px) {
  .a {
    color: green;
  }
}

.b {
  @reuse .a;
  font-size: 14px;
}
```

</td><td>

```CSS
.a {
  color: red;
}

@media (min-width: 240px) {
  .a {
    color: green;
  }
}

.b {
  color: red;
  font-size: 14px;
}

@media (min-width: 240px) {
  .b {
    color: green;
  }
}
```

</td></tr>
</table>
