module.exports = input => {

  let output = splitCamelCase(input).replace("_", " ").split(" ");
  output = output.map(x => x.toLowerCase())
  output[0] = output[0].charAt(0).toUpperCase() + output[0].slice(1).toLowerCase()
  return output.join(" ")
}

const splitCamelCase = (text) => {
  return text.replace(/([a-z])([A-Z])/g, '$1 $2');
}
