const ImportedJournal = ({ importedJournal }) => {
  return (
    <div className='col-12 mb-2 imported-entry'>
      <div className='page-content-title mb-2'>
        <p className='mb-2'>IMPORTED JOURNAL ENTRY</p>
        <div className='upload-item mb-1'>
        <p className='m-0'>{importedJournal.userEntry}</p>
      </div>
        <p className='mb-1'>
          Journal:{' '}
          <span className='fw-bold'>{importedJournal.journalTitle}</span>
        </p>
        <p className='mb-0'>
          Journal Entry:{' '}
          <span className='fw-bold'>{importedJournal.journalEntry}</span>
        </p>
      </div>
  
    </div>
  )
}

export default ImportedJournal
