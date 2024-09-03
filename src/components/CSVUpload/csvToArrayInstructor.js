const csvToArrayInstructor = (str, delimiter = ',') => {
  str = str.replace(/\r\n/g, '\n')

  const headers = str
    .slice(0, str.indexOf('\n'))
    .split(delimiter)
    .map((header) => {
      if (
        header === 'Password' ||
        header === 'Levels' ||
        header === 'Year' ||
        header === 'Period' ||
        header === 'Programs' ||
        header === 'Name' ||
        header === 'Email' ||
        header === 'Profession'
      )
        header = header.toLowerCase()
      return header
    })

  if (
    headers[1] !== 'name' ||
    headers[2] !== 'email' ||
    headers[3] !== 'password' ||
    headers[4] !== 'levels' ||
    headers[5] !== 'programs' ||
    headers[6] !== 'profession'
  ) {
    throw new Error('Invalid CSV Format for Instructors')
  }

  const rows = str.slice(str.indexOf('\n') + 1).split('\n')

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
        } else if (header === 'levels' || header === 'programs') {
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

export default csvToArrayInstructor
