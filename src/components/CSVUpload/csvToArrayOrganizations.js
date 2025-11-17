const csvToArrayOrganizations = (str, delimiter = ',') => {
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

  console.log('📋 CSV Headers detected:', headers)
  console.log('🔧 Using delimiter:', delimiter === '\t' ? 'TAB' : delimiter)

  if (
    headers[0] !== 'organizationName' ||
    headers[1] !== 'domain' ||
    headers[2] !== 'administratorName' ||
    headers[3] !== 'administratorEmail' ||
    headers[4] !== 'address' ||
    headers[5] !== 'city' ||
    headers[6] !== 'state' ||
    headers[7] !== 'zipCode' ||
    headers[8] !== 'learnerMonthlyPrice' ||
    headers[9] !== 'learnerYearlyPrice'
  ) {
    console.error('❌ Invalid headers:', headers)
    throw new Error('Invalid CSV Format for Organizations. Expected headers: organizationName, domain, administratorName, administratorEmail, address, city, state, zipCode, learnerMonthlyPrice, learnerYearlyPrice')
  }

  const rows = str.slice(str.indexOf('\n') + 1).split('\n')

  const arr = rows
    .filter((row) => row.trim() !== '')
    .map((row, rowIndex) => {
      const values = row
        .split(delimiter)
        .map((val) => val.replace(/^"|"$/g, '').trim())

      console.log(`📊 Row ${rowIndex + 2} raw values:`, values)

      const el = headers.reduce((object, header, index) => {
        let value = values[index]
        
        if (value === '' || value === undefined) {
          value = null
        }
        
        if (header === 'learnerMonthlyPrice' || header === 'learnerYearlyPrice') {
          if (value !== null && value !== '') {
            const numValue = parseFloat(value)
            object[header] = !isNaN(numValue) ? numValue : null
            console.log(`💰 ${header}: "${value}" → ${object[header]}`)
          } else {
            object[header] = null
            console.log(`💰 ${header}: empty/null → null`)
          }
        } else {
          object[header] = value
        }
        
        return object
      }, {})

      console.log('✅ Parsed organization object:', el)
      return el
    })

  console.log('📦 Final parsed array:', arr)
  return arr
}

export default csvToArrayOrganizations