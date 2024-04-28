
// TODO - Move to npm package
const checkFieldsOn = (fields, obj) => {
  for (let field of fields)
    if (!(field in obj)) return field;
  return null;
}

module.exports = checkFieldsOn;