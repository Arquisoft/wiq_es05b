const fieldChecker = (fields, obj) => {
  for (let field of fields)
    if (!(field in obj)) return field;
  return null;
}

module.exports = fieldChecker;