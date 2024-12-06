import '../index.css'

function MenuOption({
  allowedToShow,
  title,
  setJournalSelectedId,
  setJournalSelected,
  selectedJournal,
  id,
  journal
}) {
  const handleClick = (e) => {
    e.stopPropagation() // Prevent the click event from propagating to the parent

    setJournalSelectedId(id)
    setJournalSelected(journal)
  }

  return (
    <>
      {allowedToShow && (
        <div
          // className={`menu-option d-flex justify-content-between ${
          //   selectedJournal == title ? 'journal-active' : ''
          // }`}
          className={`menu-option d-flex justify-content-between ${
            selectedJournal.title === title ? 'journal-active' : ''
          }`}
          onClick={handleClick}
        >
          {console.log(selectedJournal, title, 'titleeee')}
          <h5 className='my-auto'>{title}</h5>
        </div>
      )}
    </>
  )
}

export default MenuOption
