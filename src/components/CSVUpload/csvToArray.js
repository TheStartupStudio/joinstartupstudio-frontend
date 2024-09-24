const csvToArray = (str, delimiter = ',') => {
  str = str.replace(/\r\n/g, '\n')
  const headers = str
    .slice(0, str.indexOf('\n'))
    .split(delimiter)
    .map((header) => {
      if (
        header === 'Password' ||
        header === 'Levels' ||
        header === 'Year' ||
        header === 'Email' ||
        header === 'FirstName' ||
        header === 'LastName' ||
        header === 'Period'
      )
        header = header.toLowerCase()
      return header
    })

  console.log('headers', headers)

  if (
    headers[0] !== 'firstname' ||
    headers[1] !== 'lastname' ||
    headers[2] !== 'email' ||
    headers[3] !== 'password' ||
    headers[4] !== 'levels' ||
    headers[5] !== 'year' ||
    headers[6] !== 'period'
  ) {
    throw new Error('Invalid CSV Format')
  }

  const rows = str.slice(str.indexOf('\n') + 1).split('\n')
  // const arr = rows.map(function (row) {
  //   const values = row.split(delimiter)

  //   const el = headers.reduce(function (object, header, index) {
  //     const value = values[index] ? values[index].trim() : null

  //     if (header === 'period' && value === '') {
  //       object[header.trim()] = null
  //     } else if (header === 'levels') {
  //       object[header.trim()] = value
  //         ? value.split(/,\s*/).map((item) => item.trim())
  //         : []
  //     } else {
  //       object[header.trim()] = value
  //     }

  //     return object
  //   }, {})

  //   return el
  // })

  const arr = rows
    .filter((row) => row.trim() !== '') // Skip empty lines
    .map((row) => {
      // Split using regex to handle values with quotes
      const values = row
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map((val) => val.replace(/^"|"$/g, '').trim())

      const el = headers.reduce((object, header, index) => {
        let value = values[index] || null

        if (header === 'period' && value === '') {
          object[header] = null
        } else if (header === 'levels') {
          // Handle fields with multiple values
          object[header] = value
            ? value.split(/,\s*/).map((item) => item.trim())
            : []
        } else {
          object[header] = value
        }

        return object
      }, {})

      return el
    })

  return arr
}
export default csvToArray
