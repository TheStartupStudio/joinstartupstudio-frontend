const csvToArray = (str, delimiter = ',') => {
  str = str.replace(/\r\n/g, '\n')
  const headers = str
    .slice(0, str.indexOf('\n'))
    .split(delimiter)
    .map((header) => {
      if (
        header === 'Password' ||
        header === 'Level' ||
        header === 'Year' ||
        header === 'Period'
      )
        header = header.toLowerCase()
      return header
    })

  if (
    headers[0] !== 'FirstName' ||
    headers[1] !== 'LastName' ||
    headers[2] !== 'UserEmail' ||
    headers[3] !== 'password' ||
    headers[4] !== 'level' ||
    headers[5] !== 'year' ||
    headers[6] !== 'period'
  ) {
    throw new Error('Invalid CSV Format')
  }

  const rows = str.slice(str.indexOf('\n') + 1).split('\n')
  const arr = rows.map(function (row) {
    const values = row.split(delimiter)

    const el = headers.reduce(function (object, header, index) {
      const value = values[index] ? values[index].trim() : null

      // Check if the header is 'period' and value is an empty string
      if (header === 'period' && value === '') {
        object[header.trim()] = null // Set value to null
      } else {
        object[header.trim()] = value
      }

      return object
    }, {})

    return el
  })

  return arr
}
export default csvToArray
