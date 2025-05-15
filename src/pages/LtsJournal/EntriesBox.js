import React, { useEffect, useState } from 'react';
import markdown from './markdown';
import LtsJournalReflection from './reflection';
import axiosInstance from '../../utils/AxiosInstance';
import { getFormattedDate } from '../../utils/helpers';
import AddDoc from '../../assets/images/academy-icons/add-doc.png';
import { toast } from 'react-toastify';

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
    deleteReflection: deleteReflectionProp, // Rename prop
    updateReflection,
    addReflection,
    entries,
    isEditable,
    isDeletable,
    accordion,
    onReflectionContentChange,
    setUserJournalEntries,
    dispatch,
    fetchLtsCoursefinishedContent
  } = props;

  const [isSaving, setIsSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [accordionDates, setAccordionDates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reflectionToDelete, setReflectionToDelete] = useState(null);

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

  const handleDeleteReflection = async (entry, userJournalEntry) => { // Renamed function
    try {
      // Delete from API
      await axiosInstance.delete(
        `/ltsJournals/${journal?.id}/entries/${entry.id}/userEntries/${userJournalEntry.id}`
      );

      // Update local state to remove reflection
      const updatedEntries = userJournalEntries[entry.id].filter(
        reflection => reflection.id !== userJournalEntry.id
      );

      if (updatedEntries.length > 0) {
        // If there are still other reflections, update the array
        props.updateReflection(entry.id, updatedEntries);
      } else {
        // If this was the last reflection, remove the entire entry
        const newUserJournalEntries = { ...userJournalEntries };
        delete newUserJournalEntries[entry.id];
        props.setUserJournalEntries(newUserJournalEntries);
      }

      toast.success('Reflection deleted successfully');
      
      await dispatch(fetchLtsCoursefinishedContent());

    } catch (error) {
      console.error('Delete reflection error:', error);
      toast.error('Failed to delete reflection');
    }
  };

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
    const reflectionToRemove = `${journal?.id}_${entryId}_new`;
    
    onReflectionContentChange(null, {
      content: null,
      journalId: journal?.id,
      journalEntryId: entryId,
      entryId: null,
      remove: true // Add flag to indicate removal
    });

    // Clear from local state
    setNewReflectionEntries((prev) => {
      const updated = { ...prev };
      delete updated[entryId];
      return updated;
    });
  };

  const handleDeleteClick = (entry, reflection) => {
    setReflectionToDelete({ entry, reflection });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (reflectionToDelete) {
      await handleDeleteReflection( // Update function call
        reflectionToDelete.entry,
        reflectionToDelete.reflection
      );
      setShowDeleteModal(false);
      setReflectionToDelete(null);
    }
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
                      onDelete={() => handleDeleteClick(entry, userJournalEntry)} // New delete handler
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
