module.exports = (from, oldName, newName) =>
  from
    .split(' ')
    .map((group) =>
      group
        .split('.')
        .map((className) =>
          className === oldName.slice(1) ? newName.slice(1) : className,
        )
        .join('.'),
    )
    .map((className) => (className === oldName ? newName : className))
    .join(' ');
