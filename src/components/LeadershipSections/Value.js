import { faCircle, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect, forwardRef, useImperativeHandle, memo } from 'react'
import ReactQuill from 'react-quill'
import AddDoc from '../../assets/images/academy-icons/add-doc.png'
import Light from '../../assets/images/academy-icons/light.png'
import SectionsWrapper from './SectionsWrapper'
import LeadershipTextEditor from './LeadershipTextEditor'
import MediaLightbox from '../../components/MediaLightbox'
import axiosInstance from '../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { getJournalData } from '../../redux/journal/Actions'
import { toast } from 'react-toastify'
import { NotesButton } from '../Notes'
import { useHistory } from 'react-router-dom'

const Value = memo(forwardRef(({ id, setIsReflection, onTitleChange }, ref) => {
  const [currentId, setCurrentId] = useState(id)
  const [pendingChanges, setPendingChanges] = useState({})
  const [showVideo, setShowVideo] = useState(false)
  const dispatch = useDispatch()
  const { journalData } = useSelector((state) => state.journal)

  useEffect(() => {
    setCurrentId(id)
  }, [id])

  const refreshData = () => {
    dispatch(getJournalData(currentId))
  }

  useEffect(() => {
    refreshData()
    // Clear any stale title when currentId changes
    onTitleChange?.('')
  }, [currentId])

  useEffect(() => {
    if (journalData?.title) {
      onTitleChange?.(journalData.title)
    }
  }, [journalData?.title]) // Remove onTitleChange from dependencies

  const handleContentChange = (entryId, data) => {
    setPendingChanges((prev) => ({
      ...prev,
      [entryId]: {
        content: data.content,
        isExisting: data.isExisting,
        journalId: currentId,
        entryId: entryId,
        order: typeof data.order === 'number' ? data.order : 0
      }
    }))
  }

  const findNextLesson = (currentId) => {
    const lessons = [
      { 
        now: <Value id={1001065} setIsReflection={setIsReflection} />,
        next: <Value id={1001066} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001066} setIsReflection={setIsReflection} />,
        next: <Value id={1001067} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001067} setIsReflection={setIsReflection} />,
        next: <Value id={1001068} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001069} setIsReflection={setIsReflection} />,
        next: <Value id={1001070} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001070} setIsReflection={setIsReflection} />,
        next: <Value id={1001071} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001071} setIsReflection={setIsReflection} />,
        next: <Value id={1001072} setIsReflection={setIsReflection} />
      },

      { 
        now: <Value id={1001073} setIsReflection={setIsReflection} />,
        next: <Value id={1001074} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001074} setIsReflection={setIsReflection} />,
        next: <Value id={1001075} setIsReflection={setIsReflection} />
      },
      { 
        now: <Value id={1001075} setIsReflection={setIsReflection} />,
        next: <Value id={1001076} setIsReflection={setIsReflection} />
      }
    ]
    return lessons.find(l => l.now.props.id === parseInt(currentId))?.next
  }

  useImperativeHandle(ref, () => ({
    saveChanges: async () => {
      try {
        const savePromises = Object.entries(pendingChanges).map(
          async ([entryId, data]) => {
            try {
              const postResponse = await axiosInstance.post(
                `/ltsJournals/ltsjournalEntries/${currentId}/${entryId}`,
                {
                  content: data.content,
                  order: data.order
                }
              )
              toast.success('Answer submitted successfully!')
              return postResponse
            } catch (postError) {
              if (postError.response?.status === 400 || data.isExisting) {
                const putResponse = await axiosInstance.put(
                  `/ltsJournals/ltsjournalEntries/${currentId}/${entryId}`,
                  {
                    content: data.content,
                    order: data.order
                  }
                )
                toast.success('Changes saved successfully!')
                return putResponse
              }
              throw postError
            }
          }
        )

        await Promise.all(savePromises)
        setPendingChanges({})
        await refreshData()

        const allEntriesHaveContent = journalData?.entries.every(entry => 
          entry.userAnswers && entry.userAnswers.length > 0
        )

        if (allEntriesHaveContent) {
          const nextComponent = findNextLesson(parseInt(currentId))
          if (nextComponent) {
            const nextId = nextComponent.props.id
            setCurrentId(nextId)
            dispatch(getJournalData(nextId)).then(() => {
              // Update title after data is fetched
              if (journalData?.title) {
                onTitleChange?.(journalData.title)
              }
            })
          }
        }

      } catch (error) {
        console.error('Error saving reflections:', error)
      }
    }
  }))

  const parseContent = (content) => {
    if (!content) return null

    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')

    const paragraphs = Array.from(doc.querySelectorAll('p')).map(
      (p) => p.textContent
    )

    const listItems = Array.from(doc.querySelectorAll('li')).map(
      (li) => li.textContent
    )

    return { paragraphs, listItems }
  }

  const { paragraphs, listItems } = parseContent(journalData?.content) || {}

  setIsReflection(true)

  const noteButtonStyles = {
    position: 'absolute',
    bottom: '100px',
    right: '1rem',
    zIndex: 99999999
  }

  return (
    <div className='d-grid grid-col-2 gap-4 grid-col-1-mob'>
      <SectionsWrapper title={journalData?.title}>
        <div style={{ position: 'relative' }}>
          <div style={noteButtonStyles}>
            <NotesButton
              from="leadershipJournal"
              data={{
                id: currentId,
                title: journalData?.title
              }}
              createdFrom={journalData?.title || 'Leadership Journal'}
              journalId={currentId}
            />
          </div>

          {journalData?.video && (
            <>
              <div className="mb-4">
                <div
                  className="journal-entries__video-thumbnail"
                  onClick={() => setShowVideo(true)}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    aspectRatio: '16 / 9',
                  }}
                >
                  <img
                    src={journalData.video.thumbnail}
                    alt="video thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="journal-entries__video-thumbnail-icon"
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
              </div>

              {showVideo && (
                <MediaLightbox
                  video={journalData.video}
                  show={showVideo}
                  onClose={() => setShowVideo(false)}
                />
              )}
            </>
          )}

          <div
            dangerouslySetInnerHTML={{ __html: journalData?.content }}
          />
        </div>
      </SectionsWrapper>

      <SectionsWrapper img={Light} title={'Reflection'}>
        {journalData?.entries.map((item, index) => (
          <LeadershipTextEditor
            key={item.id}
            title={item.title}
            id={item.id}
            journalId={currentId}
            onContentChange={handleContentChange}
            userAnswers={item.userAnswers}
            order={index}
            isLastEntry={index === journalData.entries.length - 1}
            showControls={index === journalData.entries.length - 1}
          />
        ))}
      </SectionsWrapper>
    </div>
  )
}), (prevProps, nextProps) => {
  return prevProps.id === nextProps.id
})

export default Value
