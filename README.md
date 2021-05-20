# PostCSS re-use

## Install

```
$ npm install postcss-reuse
```

## Usage

Add `postcss-reuse` to your list of postcss plugins.

```JavaScript
plugins: [
  'tailwindcss',
  'postcss-reuse',
  'postcss-preset-env',
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
  @inline .a;
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
  @inline .a;
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
  @inline .a;
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
  @inline .a;
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

## Attributions

Based of [Alexandru Kis](https://github.com/alexandrukis)' PostCSS plugin [@SectorLabs/postcss-inline-class](https://github.com/SectorLabs/postcss-inline-class#readme).
