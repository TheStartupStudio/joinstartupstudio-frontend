import React from 'react'
import markdown from './markdown'
import LtsJournalReflection from './reflection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons'

const EntriesBox = (props) => {
  const {
    entry,
    userJournalEntries,
    journal,
    deleteReflection,
    updateReflection,
    addReflection,
    handleShowAddReflection,
    showAddReflection,
    entries
  } = props

  return entries && entries.length > 1 ? (
    <div style={{ border: '1px solid #BBBDBF' }}>
      {/* {journal.title && (
          <div
            className="journal-entry__parent-title"
            style={{
              marginTop: 0,
              marginBottom: 0,
              fontSize: 14,
              textTransform: 'uppercase'
            }}
          >
            <h5 style={{ fontSize: 14, padding: 6 }}>{journal.title}</h5>
          </div>
        )} */}
      {entries &&
        entries?.map((entry, index) => (
          <div
            className="journal-entries__entry"
            key={entry.id}
            style={{ marginBottom: 0 }}
          >
            {entry.parentTitle && (
              <div className="journal-entry__parent-title">
                <h5>{entry.parentTitle}</h5>
              </div>
            )}{' '}
            <h4
              style={{
                padding: 12,
                backgroundColor: '#e5e5e5',
                marginBottom: 0,
                fontSize: 12,
                fontWeight: 700
              }}
              className={
                'journal-entries__entry-title' +
                (entry.title.indexOf('**') !== -1
                  ? ' journal-entries__entry-title--md'
                  : '')
              }
              dangerouslySetInnerHTML={{
                __html:
                  entry.title.indexOf('<h2>') === -1
                    ? markdown(entry.title)
                    : entry.title.replace(new RegExp('\r?\n', 'g'), '<br />')
              }}
            ></h4>
            <div className="journal-entries__entry-reflections">
              {/* List created reflections */}
              {userJournalEntries[entry.id] &&
                userJournalEntries[entry.id].map((userJournalEntry) => (
                  <LtsJournalReflection
                    key={userJournalEntry.id}
                    journal={journal}
                    journalEntry={entry}
                    userEntry={journal.userEntry}
                    entry={userJournalEntry}
                    deleted={deleteReflection(entry, userJournalEntry)}
                    saved={updateReflection(entry, userJournalEntry)}
                  />
                ))}
              {/* Add new reflection */}
              {(!userJournalEntries[entry.id] ||
                showAddReflection[entry.id]) && (
                <LtsJournalReflection
                  journal={journal}
                  journalEntry={entry}
                  userEntry={journal.userEntry}
                  entry={null}
                  saved={addReflection(entry)}
                  showCancel={!!userJournalEntries[entry.id]}
                  cancel={(e) => {
                    handleShowAddReflection({
                      ...showAddReflection,
                      [entry.id]: false
                    })
                  }}
                />
              )}
              {/*Show add new reflection*/}
              {/*<div*/}
              {/*  className={`journal-entries__entry-reflections-actions ${*/}
              {/*    userJournalEntries[entry.id] && !showAddReflection[entry.id]*/}
              {/*      ? 'active'*/}
              {/*      : ''*/}
              {/*  }`}*/}
              {/*>*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="journal-entries__entry-reflections-action"*/}
              {/*    onClick={(e) => {*/}
              {/*      e.preventDefault()*/}
              {/*      handleShowAddReflection({*/}
              {/*        ...showAddReflection,*/}
              {/*        [entry.id]: true*/}
              {/*      })*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    Add reflection <FontAwesomeIcon icon={faPlus} />*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
            {entry.contentAfter && (
              <div
                className="page-card__content-description journal-entry__content-after"
                dangerouslySetInnerHTML={{
                  __html: entry.contentAfter
                }}
              ></div>
            )}
          </div>
        ))}
    </div>
  ) : (
    <></>
  )
}

export default EntriesBox
