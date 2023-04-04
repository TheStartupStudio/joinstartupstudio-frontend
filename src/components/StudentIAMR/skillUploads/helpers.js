export const types = [
  'Article',
  'Brand Charter',
  'Brand Guidelines Booklet',
  'Branded Material',
  'Brand Vehicle',
  'Brand Video',
  'Business Plan',
  'Concept Plan',
  'Course Certification',
  'Financial Document',
  'Form of Communication',
  'I Am Video',
  'Industry Analysis',
  'Journal Entry',
  'Market Analysis',
  'Model',
  'Piece of Art',
  'Piece of Code',
  'Piece of Music',
  'Prototype',
  'Slide Deck',
  'Social Media Content',
  'Website',
  'Other'
]

export const UploadStatus = ({ status }) => {
  return (
    <span className={`float-end`} title={`Status: ${status}`}>
      Status:{' '}
      <span className={`upload-status ${status}`}>{status ?? 'SAVED'}</span>
    </span>
  )
}
