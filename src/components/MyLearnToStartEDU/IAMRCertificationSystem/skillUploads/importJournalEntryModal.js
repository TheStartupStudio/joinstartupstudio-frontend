import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import Select, { components } from 'react-select'
import { useEffect } from 'react'
import searchIcon from '../../../../assets/images/search-icon.png'
import { useIamrContext } from '../iamrContext/context'
import { toast } from 'react-toastify'

const ImportJournalEntryModal = ({
  show,
  onHide,
  handleJournalEntryImport
}) => {
  const { journalEntries } = useIamrContext()
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState()
  const journal = selectedJournal?.value

  const hideModal = () => {
    onHide()
    setSelectedEntry()
  }

  const handleImport = () => {
    if (!selectedEntry) return toast.error('Please select an entry.')

    handleJournalEntryImport({
      ...selectedEntry,
      userEntry: selectedEntry?.userEntry?.replace(/<[^>]+>/g, '')
    })
    hideModal()
  }

  useEffect(() => {
    if (journalEntries?.length) {
      setJournalOptions(
        journalEntries.map((journal, index) => {
          return {
            label: journal.title,
            value: journal,
            key: index
          }
        })
      )
    }
  }, [journalEntries])

  useEffect(() => {
    setSelectedEntry()
  }, [selectedJournal])

  const handleJournalSelect = (e) => {
    setSelectedJournal({ value: e.value, label: e.label })
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <img
              src={searchIcon}
              alt='#'
              style={{
                color: '#333d3d',
                height: '25px',
                width: '25px',
                position: 'absolute',
                left: '10px'
                // cursor: 'pointer'
              }}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }

  return (
    <Modal
      show={show}
      onHide={hideModal}
      backdrop='static'
      keyboard={false}
      className='import-entry-modal'
      centered
    >
      <Modal.Header className='contact-us-title my-auto mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>IMPORT JOURNAL ENTRY</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={hideModal}
        />
      </Modal.Header>
      <Modal.Body className='m-4 p-0'>
        <div className='contact-us'>
          <Select
            value={
              selectedJournal?.label
                ? { label: selectedJournal?.label }
                : {
                    label: 'SEARCH JOURNALS BY NAME'
                  }
            }
            onChange={handleJournalSelect}
            options={journalOptions}
            placeholder={'SEARCH FOR A JOURNAL'}
            // openMenuOnClick={false}
            // isDisabled={selectDisabled}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              outLine: 'none',
              colors: {
                ...theme.colors,
                // primary25: 'hotpink',
                primary: '#e4e4e4',
                neutral0: '#e4e4e4',
                opacity: 1,
                zIndex: 100
              },
              spacing: {
                ...theme.spacing,
                controlHeight: 32
              },
              zIndex: 100
            })}
            styles={{
              control: (provided, state) => ({
                ...provided,
                boxShadow: 'none',
                border: 'none',
                height: 15,
                fontSize: '14px',
                height: '50px'
              }),
              menu: (base) => ({
                ...base,
                border: 'none',
                boxShadow: 'none',
                fontSize: '14px'
              }),
              valueContainer: (base) => ({
                ...base,
                paddingLeft: 50
              })
            }}
            components={{
              ValueContainer,
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
            classNamePrefix='vyrill'
            // autoFocus={false}
          />
          {journal && (
            <h5 className='text-center mt-3'>
              <span className='fw-bold'>JOURNAL: </span> {journal.title}
            </h5>
          )}

          <div className='journal-container mb-3'>
            {journal && (
              <>
                {journal.entries.map((entry) => {
                  const isHtml = /<[a-z][\s\S]*>/i.test(entry.title)
                  return (
                    <div className='entry py-3' key={entry.id}>
                      <p>
                        <span className='fw-bold'>Journal Entry: </span>
                        {isHtml ? (
                          <span
                            dangerouslySetInnerHTML={{ __html: entry.title }}
                          />
                        ) : (
                          entry.title
                        )}
                      </p>
                      <p className='fw-bold'>Your entries: </p>
                      {entry.userAnswers.map((answer) => (
                        <div
                          className={`answer m-3 ${
                            selectedEntry?.id === answer.id ? 'selected' : ''
                          }`}
                          onClick={() =>
                            setSelectedEntry({
                              journalTitle: journal.title,
                              journalEntry: entry.title,
                              userEntry: answer.content,
                              id: answer.id
                            })
                          }
                          key={answer.id}
                        >
                          <div>{answer.content.replace(/<[^>]+>/g, '')}</div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </>
            )}
          </div>
          {selectedEntry && (
            <button type='submit' onClick={handleImport}>
              IMPORT
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default ImportJournalEntryModal
