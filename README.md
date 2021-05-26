# PostCSS re-use

Re-use rules by inlining other previously declared rules' content using postcss.

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

> [More examples](#examples)


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
- `{String} mode = 'selector'` The way the at rule's parameter is parsed. Can be either `'selector'` or `'class'`. In selector mode the parameters are parsed as a comma separated list of selectors. In class mode the parameter are parsed as a space separated list of class names.

```JavaScript
plugins: [
  ['postcss-reuse', {
    atRuleName: '@inline',
    mode: 'class',
  }],
]
```

### Tailwindcss JIT

As of writing this [Tailwindcss](https://github.com/tailwindlabs/tailwindcss#readme)'s JIT mode does not support using the @apply rule for custom classes. This plugin can solve this issue all you need to do is the following:

First set the mode option of this plugin to `'class'`.

```JavaScript
plugins: [
  ['postcss-reuse', {
    mode: 'class',
  }],
]
```

Then add the `@tailwind screens;` directive after your other tailwind directives and before your custom classes. Otherwise the plugin will not be able to inherit the responsive versions of the classes.

```CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind screens;

/* TODO: Your custom CSS here with any @reuse rules. */
```

Finally ensure the following options are set in your Tailwind config.

```JS
module.exports = {
  mode: 'jit',

  purge: {
    content: [
      // TODO: Add the paths to the style sheets where you will be using the reuse plugin. Otherwise tailwind will not read what classes you want to reuse.
    ],
    options: {
      // The following extractor is the same as the default of v2, except it includes cut off points for semicolons.
      defaultExtractor: (line) => {
        return [...(line.match(/[^<>"'`;\s]*[^<>"'`;\s:]/g) || []), ...(line.match(/[^<>"'`;\s.(){}[\]#=%]*[^<>"'`;\s.(){}[\]#=%:]/g) || [])]
      },
    }
  },
}
```

## Examples

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
