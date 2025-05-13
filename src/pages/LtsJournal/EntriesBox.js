import React, { useEffect, useState } from 'react';
import markdown from './markdown';
import LtsJournalReflection from './reflection';
import axiosInstance from '../../utils/AxiosInstance';
import { getFormattedDate } from '../../utils/helpers';
import AddDoc from '../../assets/images/academy-icons/add-doc.png';

const debounce = (func, delay) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
};

const EntriesBox = (props) => {
  const {
    userJournalEntries,
    journal,
    deleteReflection,
    updateReflection,
    addReflection,
    entries,
    isEditable,
    isDeletable,
    accordion,
    onReflectionContentChange
  } = props;

  const [isSaving, setIsSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [accordionDates, setAccordionDates] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newReflectionEntries, setNewReflectionEntries] = useState({});

  useEffect(() => {
    setNewReflectionEntries({});
  }, [journal?.id, accordion?.id, entries]);

  useEffect(() => {
    if (journal?.id && accordion?.id && journal.id === 1001033) {
      setLoading(true);
      axiosInstance
        .get(`/ltsJournals/${journal?.id}/accordionsTable/${accordion?.id}`)
        .then(({ data }) => {
          setAccordionDates(data.ltsJournalsAccordionsTable);
          setIsNew(false);
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [journal?.id, accordion?.id]);

  const handleShowAddReflection = (entryId) => {
    setNewReflectionEntries({
      ...newReflectionEntries,
      [entryId]: {
        id: Date.now(),
        content: '',
      },
    });
  };

  const handleRemoveNewReflection = (entryId) => {
    setNewReflectionEntries((prev) => {
      const updated = { ...prev };
      delete updated[entryId];
      return updated;
    });
  };

  return entries && entries.length > 0 ? (
    <div>
      {entries.map((entry) => {
        const hasReflections = userJournalEntries[entry.id] && userJournalEntries[entry.id].length > 0;
        return (
          <div className='journal-entries__entry' key={entry.id}>
            {entry.parentTitle && (
              <div className='journal-entry__parent-title'>
                <h5>{entry.parentTitle}</h5>
              </div>
            )}
            <h4
              style={{ padding: '12px 40px 12px 12px', marginBottom: 0, fontSize: 12, fontWeight: 700 }}
              className='journal-entries__entry-title'
              dangerouslySetInnerHTML={{
                __html: entry.title.indexOf('<h2>') === -1 ? markdown(entry.title) : entry.title.replace(new RegExp('\r?\n', 'g'), '<br />')
              }}
            ></h4>

            <div className='journal-entries__entry-reflections'>
              {/* Existing reflections */}
              {hasReflections &&
                userJournalEntries[entry.id].map((userJournalEntry) => (
                  <div key={userJournalEntry.id}>
                    <LtsJournalReflection
                      journal={journal}
                      journalEntry={entry}
                      userEntry={journal.userEntry}
                      entry={userJournalEntry}
                      isEditable={isEditable}
                      isDeletable={isDeletable}
                      deleted={deleteReflection(entry, userJournalEntry)}
                      saved={updateReflection(entry, userJournalEntry)}
                      popupContent={null}
                      onContentChange={onReflectionContentChange}
                    />
                  </div>
                ))}

              {/* If NO reflections at all, show placeholder editor */}
              {!hasReflections && (
                <div className='mt-2'>
                  <LtsJournalReflection
                    journal={journal}
                    journalEntry={entry}
                    userEntry={journal.userEntry}
                    entry={null}
                    saved={(content) => {
                      addReflection(entry)(content);
                    }}
                    isEditable={isEditable}
                    isDeletable={false}
                    onContentChange={onReflectionContentChange}
                  />
                </div>
              )}

              {/* If explicitly adding a new reflection */}
              {hasReflections && newReflectionEntries[entry.id] && (
                <div className='mt-2'>
                  <LtsJournalReflection
                    journal={journal}
                    journalEntry={entry}
                    userEntry={journal.userEntry}
                    entry={null}
                    saved={(content) => {
                      handleRemoveNewReflection(entry.id);
                      addReflection(entry)(content);
                    }}
                    isEditable={isEditable}
                    isDeletable={isDeletable}
                    onContentChange={onReflectionContentChange}
                  />
                </div>
              )}

              {/* Bottom controls only when reflections exist */}
              {hasReflections && (
                <div className='d-flex mt-2 justify-content-end reflection-controls'>
                  <div className='d-flex gap-2 align-items-center'>
                    {newReflectionEntries[entry.id] ? (
                      <p
                        className='mb-0 fs-15 fw-medium cursor-pointer add-reflection text-center'
                        onClick={() => handleRemoveNewReflection(entry.id)}
                      >
                        Remove reflection
                      </p>
                    ) : (
                      <p
                        className='mb-0 fs-15 fw-medium cursor-pointer add-reflection text-center'
                        onClick={() => handleShowAddReflection(entry.id)}
                      >
                        Add new reflection
                      </p>
                    )}
                    <img src={AddDoc} alt={newReflectionEntries[entry.id] ? 'remove-doc' : 'add-doc'} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
};

export default EntriesBox;
