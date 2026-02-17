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
import WhoAmI from '../../assets/images/academy-icons/WhoAmI.png'
import { useRef, useCallback } from 'react'


// Utility function to strip HTML tags from text
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

// Shared Skeleton Loader component
export const SkeletonLoader = ({ className = '', style = {} }) => (
  <div
    className={`skeleton-loader ${className}`}
    style={{
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loading 1.5s infinite',
      borderRadius: '4px',
      ...style
    }}
  />
)


// Add skeleton animation styles
const skeletonStyles = `
  @keyframes loading {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = skeletonStyles
  document.head.appendChild(styleSheet)
}

// Export ContentOnlySkeleton for reuse
export const ContentOnlySkeleton = () => (
  <div className='d-grid grid-col-2 gap-4 grid-col-1-mob w-100'>
    {/* Left side - Content */}
    <div className='academy-dashboard-card p-3'>
      <SkeletonLoader style={{ width: '150px', height: '24px', marginBottom: '1rem' }} />
      {/* Video placeholder */}
      <div style={{
        width: '100%',
        aspectRatio: '16 / 9',
        marginBottom: '1rem',
        borderRadius: '8px'
      }}>
        <SkeletonLoader style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SkeletonLoader style={{ width: '100%', height: '16px' }} />
        <SkeletonLoader style={{ width: '90%', height: '16px' }} />
        <SkeletonLoader style={{ width: '95%', height: '16px' }} />
        <SkeletonLoader style={{ width: '85%', height: '16px' }} />
        <SkeletonLoader style={{ width: '100%', height: '16px' }} />
        <SkeletonLoader style={{ width: '80%', height: '16px' }} />
      </div>
    </div>

    {/* Right side - Reflection */}
    <div className='academy-dashboard-card p-3'>
      <div className='d-flex gap-3 align-items-center mb-4'>
        <SkeletonLoader style={{ width: '20px', height: '20px' }} />
        <SkeletonLoader style={{ width: '100px', height: '20px' }} />
      </div>

      {/* Multiple reflection entries */}
      {[1, 2, 3].map((item) => (
        <div key={item} style={{ marginBottom: '2rem' }}>
          <SkeletonLoader style={{ width: '200px', height: '18px', marginBottom: '0.5rem' }} />
          <SkeletonLoader style={{ width: '100%', height: '120px', borderRadius: '8px' }} />
        </div>
      ))}
    </div>
  </div>
)

const ReflectionSkeleton = () => (
  <div className='d-grid grid-col-2 gap-4 grid-col-1-mob w-100'>
    {/* Left side - Content */}
    <div className='academy-dashboard-card p-3'>
      <SkeletonLoader style={{ width: '150px', height: '24px', marginBottom: '1rem' }} />
      {/* Video placeholder */}
      <div style={{
        width: '100%',
        aspectRatio: '16 / 9',
        marginBottom: '1rem',
        borderRadius: '8px'
      }}>
        <SkeletonLoader style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SkeletonLoader style={{ width: '100%', height: '16px' }} />
        <SkeletonLoader style={{ width: '90%', height: '16px' }} />
        <SkeletonLoader style={{ width: '95%', height: '16px' }} />
        <SkeletonLoader style={{ width: '85%', height: '16px' }} />
        <SkeletonLoader style={{ width: '100%', height: '16px' }} />
        <SkeletonLoader style={{ width: '80%', height: '16px' }} />
      </div>
    </div>

    {/* Right side - Reflection */}
    <div className='academy-dashboard-card p-3'>
      <div className='d-flex gap-3 align-items-center mb-4'>
        <SkeletonLoader style={{ width: '20px', height: '20px' }} />
        <SkeletonLoader style={{ width: '100px', height: '20px' }} />
      </div>

      {/* Multiple reflection entries */}
      {[1, 2, 3].map((item) => (
        <div key={item} style={{ marginBottom: '2rem' }}>
          <SkeletonLoader style={{ width: '200px', height: '18px', marginBottom: '0.5rem' }} />
          <SkeletonLoader style={{ width: '100%', height: '120px', borderRadius: '8px' }} />
        </div>
      ))}
    </div>
  </div>
)


const Value = forwardRef((props, ref) => {
  const { id, setIsReflection, onTitleChange } = props
  const [pendingChanges, setPendingChanges] = useState({})
  const [currentId, setCurrentId] = useState(id)
  const [showVideo, setShowVideo] = useState(false)
  const dispatch = useDispatch()
  const { journalData, loading } = useSelector((state) => state.journal)
  const hasFetchedRef = useRef(false)

  const refreshData = useCallback(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      dispatch(getJournalData(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    // Reset fetch flag when id changes
    hasFetchedRef.current = false
    refreshData()
    // Clear any stale title when id changes
    onTitleChange?.('')
  }, [id, refreshData, onTitleChange])

  useEffect(() => {
    if (journalData?.title) {
      onTitleChange?.(journalData.title)
    }
  }, [journalData?.title]) // Remove onTitleChange from dependencies

  // Set isReflection based on whether journal has entries
  useEffect(() => {
    if (journalData) {
      const hasEntries = journalData.entries && journalData.entries.length > 0
      setIsReflection(hasEntries)
    }
  }, [journalData, setIsReflection])

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
                return putResponse
              }
              throw postError
            }
          }
        )

        await Promise.all(savePromises)
        setPendingChanges({})
        await refreshData()
        toast.success('Reflections submitted successfully!')
        return true
      } catch (error) {
        console.error('Error saving reflections:', error)
        return false
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

  const noteButtonStyles = {
    position: 'absolute',
    bottom: '55px !important',
    right: '1rem',
    zIndex: 99999999
  }

  // Show skeleton loading when data is loading or not available
  if (loading || !journalData) {
    // If we have journalData, check if it has entries to show appropriate skeleton
    const hasEntriesForSkeleton = journalData?.entries && journalData.entries.length > 0
    return hasEntriesForSkeleton ? <ReflectionSkeleton /> : <ContentOnlySkeleton />
  }

  // Check if this journal has reflection questions
  const hasEntries = journalData?.entries && journalData.entries.length > 0

  // If no entries, show content-only layout like intro sections
  if (!hasEntries) {
    return (
      <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
        <div className='w-100'>
          <div className='row'>
            <div className='d-grid academy-dashboard-card p-3'>
              <div className='d-flex gap-3 align-items-center mb-4 mt-2'>
              <img src={WhoAmI} alt='who-am-i' style={{ width: '40px', height: '40px' }}  />
              <h4 className='fs-18 my-details-header text-black'>{journalData?.title}</h4>
            </div>
              {journalData?.video && (
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
                    marginBottom: '2rem'
                  }}
                >
                  <img
                    src={journalData.video.thumbnail || journalData.video.url}
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
              )}

              {showVideo && journalData?.video && (
                <MediaLightbox
                  video={journalData.video}
                  show={showVideo}
                  onClose={() => setShowVideo(false)}
                />
              )}
            </div>
          </div>
        </div>

        <SectionsWrapper title={'Details'}>
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

            <div
              dangerouslySetInnerHTML={{ __html: journalData?.content || journalData?.paragraph }}
            />
          </div>
        </SectionsWrapper>
      </div>
    )
  }

  // If has entries, show normal reflection layout
  return (
    <div className='d-grid grid-col-2 gap-4 grid-col-1-mob w-100'>
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
            title={stripHtmlTags(item.title)}
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
})

export default memo(Value)
