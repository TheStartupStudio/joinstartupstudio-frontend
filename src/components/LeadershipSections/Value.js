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

const Value = memo(forwardRef(({ id, setIsReflection }, ref) => {
  const [pendingChanges, setPendingChanges] = useState({})
  const [showVideo, setShowVideo] = useState(false)
  const dispatch = useDispatch()
  const { journalData } = useSelector((state) => state.journal)

  const refreshData = () => {
    dispatch(getJournalData(id))
  }

  useEffect(() => {
    refreshData()
  }, [id])

  const handleContentChange = (entryId, data) => {
    setPendingChanges((prev) => ({
      ...prev,
      [entryId]: {
        content: data.content,
        isExisting: data.isExisting,
        journalId: id,
        entryId: entryId,
        order: typeof data.order === 'number' ? data.order : 0
      }
    }))
  }

  useImperativeHandle(ref, () => ({
    saveChanges: async () => {
      try {
        const savePromises = Object.entries(pendingChanges).map(
          async ([entryId, data]) => {
            try {
              const postResponse = await axiosInstance.post(
                `/ltsJournals/ltsjournalEntries/${id}/${entryId}`,
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
                  `/ltsJournals/ltsjournalEntries/${id}/${entryId}`,
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
        refreshData()
      } catch (error) {
        console.error('Error saving reflections:', error)
      }
    }
  }))

  const parseContent = (content) => {
    if (!content) return null

    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')

    // Extract paragraphs
    const paragraphs = Array.from(doc.querySelectorAll('p')).map(
      (p) => p.textContent
    )

    // Extract list items
    const listItems = Array.from(doc.querySelectorAll('li')).map(
      (li) => li.textContent
    )

    return { paragraphs, listItems }
  }

  const { paragraphs, listItems } = parseContent(journalData?.content) || {}

  setIsReflection(true)

  const noteButtonStyles = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 10
  }

  return (
    <div className='d-grid grid-col-2 gap-4 grid-col-1-mob'>
      <SectionsWrapper title={journalData?.title}>
        <div style={{ position: 'relative' }}>
          <div style={noteButtonStyles}>
            <NotesButton
              from="leadershipJournal"
              data={{
                id: id,
                title: journalData?.title
              }}
              createdFrom={journalData?.title || 'Leadership Journal'}
              journalId={id} // Make sure this is the correct journal ID from your database
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
            journalId={id}
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
  // Custom comparison function for memo
  return prevProps.id === nextProps.id
})

export default Value
