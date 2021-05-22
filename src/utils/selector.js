const utilList = require('./list.js')

const fromClass = (className) => {
  return '.' + className.replaceAll('.', '\\.').replaceAll(':', '\\:')
}

const replace = (selector, oldSegment, newSegment) => {
  return utilList
    .space(selector)
    .map((group) =>
      group
        .split('.')
        .map((className) =>
          className === oldSegment.slice(1) ? newSegment.slice(1) : className
        )
        .join('.')
    )
    .map((segment) => (segment === oldSegment) ? newSegment : segment)
    .join(' ')
}

module.exports = {
  fromClass: fromClass,
  replace: replace,
}
