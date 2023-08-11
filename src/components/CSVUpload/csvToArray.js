const csvToArray = (str, delimiter = ',') => {
  const headers = str
    .slice(0, str.indexOf('\n'))
    .split(delimiter)
    .map((header) => {
      if (
        header === 'Password' ||
        header === 'Level' ||
        header.includes('Year')
      )
        header = header.toLowerCase()
      return header
    })

  if (
    headers[0] !== 'FirstName' ||
    headers[1] !== 'LastName' ||
    headers[2] !== 'UserEmail' ||
    headers[3] !== 'password' ||
    headers[4] !== 'level' 
    || headers[5] !== 'year' || headers[6] !== 'period'
  ) {
    throw new Error('Invalid CSV Format')
  }

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
