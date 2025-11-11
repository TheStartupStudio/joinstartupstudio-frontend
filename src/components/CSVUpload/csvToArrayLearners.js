const csvToArrayLearners = (str, delimiter = ',') => {
  str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  const firstLine = str.slice(0, str.indexOf('\n'))
  delimiter = firstLine.includes(';') ? ';' : ','

  const headers = firstLine.split(delimiter).map((header) => {
    if (
      [
        'Password',
        'Level',
        'Year',
        'Period',
        'Year',
        'Name',
        'Email',
        'Profession',
        'Gender',
        'BirthDate',
        'Address',
        'City',
        'State',
        'UniversityId'
      ].includes(header)
    ) {
      return header.toLowerCase()
    }
    return header
  })

  if (headers[0] === 'School Assignment') {
    headers[0] = 'universityName'
  }

  if (headers[1] === 'Instructor Name') {
    headers[1] = 'instructorName'
  }

  if (headers[2] === 'Student Name') {
    headers[2] = 'name'
  }

  // Updated header validation for learners
  if (
    headers[0] !== 'learnerName' ||
    headers[1] !== 'email' ||
    headers[2] !== 'password' ||
    headers[3] !== 'gender' ||
    headers[4] !== 'birthDate' ||
    headers[5] !== 'address' ||
    headers[6] !== 'city' ||
    headers[7] !== 'state' ||
    headers[8] !== 'universityId'
  ) {
    throw new Error('Invalid CSV Format for Learners')
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