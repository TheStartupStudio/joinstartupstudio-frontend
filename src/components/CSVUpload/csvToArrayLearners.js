const csvToArrayLearners = (str, delimiter = ',') => {
  str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  const firstLine = str.slice(0, str.indexOf('\n'))
  if (firstLine.includes('\t')) {
    delimiter = '\t'
  } else if (firstLine.includes(';')) {
    delimiter = ';'
  } else {
    delimiter = ','
  }

  const headers = firstLine.split(delimiter).map((header) => header.trim())

  if (headers[0] === 'School Assignment') {
    headers[0] = 'universityName'
  }

  if (headers[1] === 'Instructor Name') {
    headers[1] = 'instructorName'
  }

  if (headers[2] === 'Student Name') {
    headers[2] = 'name'
  }

  const expectedNewHeaders = [
    'learnerName',
    'email',
    'password',
    'gender',
    'birthDate',
    'address',
    'city',
    'country',
    'organization'
  ]

  const expectedLegacyHeaders = [
    'learnerName',
    'email',
    'password',
    'gender',
    'birthDate',
    'address',
    'city',
    'state',
    'universityId'
  ]

  const matchesHeaders = (expectedHeaders) =>
    expectedHeaders.every((header, index) => headers[index] === header)

  if (
    !matchesHeaders(expectedNewHeaders) &&
    !matchesHeaders(expectedLegacyHeaders)
  ) {
    throw new Error(
      'Invalid CSV Format for Learners. Expected headers: learnerName, email, password, gender, birthDate, address, city, country, organization'
    )
  }

  const rows = str.slice(str.indexOf('\n') + 1).split('\n')

  const arr = rows
    .filter((row) => row.trim() !== '') // Skip empty lines
    .map((row) => {
      const values = row
        .split(new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`))
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

export default csvToArrayLearners
