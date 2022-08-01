const csvToArray = (str, delimiter = ',') => {
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter)
  const rows = str.slice(str.indexOf('\n') + 1).split('\n')
  const arr = rows.map(function (row) {
    const values = row.split(delimiter)
    const el = headers.reduce(function (object, header, index) {
      object[header.trim()] = values[index]
        ? values[index].trim()
        : values[index]
      return object
    }, {})
    return el
  })
  // return the array
  return arr
}
export default csvToArray
