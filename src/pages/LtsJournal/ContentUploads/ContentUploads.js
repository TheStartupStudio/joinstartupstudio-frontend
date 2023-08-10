import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import ContentUploadBox from './ContentUploadBox'
const ContentUploads = ({ journal }) => {
  const [contentUploads, setContentUploads] = useState([])
  console.log(contentUploads)
  useEffect(() => {
    const ids = journal.userContentUploads.map((item1) => item1.contentUploadId)

    const differentContentUploads = journal.contentUploads.filter(
      (item1) => !ids.includes(item1.id)
    )
    setContentUploads(
      [...differentContentUploads, ...journal.userContentUploads]
        .slice()
        .sort((a, b) => a.order - b.order)
    )
  }, [journal.userContentUploads, journal.contentUploads])

  const handleToggleContentUpload = (contentUpload, status) => {
    if (contentUpload.hasOwnProperty('contentUploadId')) {
      debugger
      axiosInstance
        .put(`/contentUploads/updateUserContentUpload/`, {
          contentUpload: { ...contentUpload, status: status }
        })
        .then(({ data }) => {
          const updatedContents = contentUploads.map((s) =>
            s.hasOwnProperty('contentUploadId') && s.id === data.id ? data : s
          )
          setContentUploads(updatedContents)
        })
    } else {
      const newContentUpload = {
        journalId: contentUpload.journalId,
        order: contentUpload.order,
        status: status,
        title: contentUpload.title,
        content: contentUpload.content,
        contentUploadId: contentUpload.id
      }

      axiosInstance
        .post(`/contentUploads/createUserContentUpload/`, {
          contentUpload: newContentUpload
        })
        .then(({ data }) => {
          const foundedContentUploadIndex = contentUploads.findIndex(
            (s) =>
              s.hasOwnProperty('contentUploadId') && s.id === contentUpload.id
          )
          const newContentUploads = [...contentUploads]
          newContentUploads.splice(foundedContentUploadIndex, 1, data)
          setContentUploads(newContentUploads)
        })
    }
  }

  const updateContentSelection = (skill) => {
    if (skill.status === 'not_selected') {
      handleToggleContentUpload(skill, 'selected')
    } else if (skill.status === 'selected') {
      handleToggleContentUpload(skill, 'added')
    } else if (skill.status === 'added') {
      handleToggleContentUpload(skill, 'not_selected')
    }
  }

  return (
    <div>
      {journal?.contentUploads?.length ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          {contentUploads.map((contentUpload) => {
            return (
              <div
                className={
                  'd-flex flex-column justify-content-center align-items-center'
                }
              >
                <ContentUploadBox
                  title={contentUpload.title}
                  onSelectContent={() => updateContentSelection(contentUpload)}
                  isAdded={contentUpload?.status === 'added'}
                  isSelected={contentUpload?.status === 'selected'}
                />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default ContentUploads

// import React, { useEffect, useState } from 'react'
// import ContentUploadBox from './ContentUploadBox'
// import axiosInstance from '../../../utils/AxiosInstance'
// import { useParams } from 'react-router-dom'
//
// const ContentUploads = ({ journal }) => {
//   const [contentUploads, setContentUploads] = useState({})
//
//   const [selectedContent, setSelectedContent] = useState([])
//
//   const [userContentUploads, setUserContentUploads] = useState({})
//
//   const [userContentUploadsId, setUserContentUploadsId] = useState(0)
//
//   function isObject(obj) {
//     return !!obj
//   }
//
//   useEffect(() => {
//     if (journal.contentUploads && !isObject(journal.userContentUploads)) {
//       setContentUploads(journal.contentUploads)
//     }
//   }, [journal.contentUploads, journal.userContentUploads])
//   useEffect(() => {
//     if (journal.userContentUploads) {
//       setContentUploads(journal.userContentUploads)
//       setUserContentUploads(journal.userContentUploads)
//     }
//   }, [journal.userContentUploads])
//
//   const params = useParams()
//   const handleToggleContent = (name, value) => {
//     const contentUploadsBody = {
//       ...contentUploads,
//       [name]: value
//     }
//
//     axiosInstance
//       .put(
//         `/contentUploads/${contentUploads.id}/userContentUploads/${
//           userContentUploadsId ? userContentUploadsId : userContentUploads.id
//         }/journal/${params.journalId}/`,
//         contentUploadsBody
//       )
//       .then(({ data }) => {
//         if (data) {
//           setUserContentUploadsId(data.id)
//           setContentUploads((contentUploads) => ({ ...contentUploads, data }))
//         }
//       })
//
//     setContentUploads((contentUploads) => ({
//       ...contentUploads,
//       [name]: value
//     }))
//   }
//
//   const updateContentSelection = (contentType) => {
//     if (contentUploads[contentType] === 'selected') {
//       handleToggleContent(contentType, 'added')
//     } else if (contentUploads[contentType] === 'not_selected') {
//       handleToggleContent(contentType, 'selected')
//     } else if (contentUploads[contentType] === 'added') {
//       handleToggleContent(contentType, 'not_selected')
//     }
//   }
//
//   return (
//     <div>
//       {contentUploads ? (
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: '20px'
//           }}
//         >
//           <ContentUploadBox
//             title="Article"
//             onSelectContent={() => updateContentSelection('article')}
//             isAdded={contentUploads?.article === 'added'}
//             isSelected={contentUploads?.article === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Brand Chapter"
//             onSelectContent={() => updateContentSelection('brandChapter')}
//             isAdded={contentUploads?.brandChapter === 'added'}
//             isSelected={contentUploads?.brandChapter === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Brand Guidelines Booklet"
//             onSelectContent={() =>
//               updateContentSelection('brandGuidelinesBooklet')
//             }
//             isAdded={contentUploads?.brandGuidelinesBooklet === 'added'}
//             isSelected={contentUploads?.brandGuidelinesBooklet === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Branded Material"
//             onSelectContent={() => updateContentSelection('brandedMaterial')}
//             isAdded={contentUploads?.brandedMaterial === 'added'}
//             isSelected={contentUploads?.brandedMaterial === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Brand Vehicle"
//             onSelectContent={() => updateContentSelection('brandVehicle')}
//             isAdded={contentUploads?.brandVehicle === 'added'}
//             isSelected={contentUploads?.brandVehicle === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Brand Video"
//             onSelectContent={() => updateContentSelection('brandVideo')}
//             isAdded={contentUploads?.brandVideo === 'added'}
//             isSelected={contentUploads?.brandVideo === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Business Plan"
//             onSelectContent={() => updateContentSelection('businessPlan')}
//             isAdded={contentUploads?.businessPlan === 'added'}
//             isSelected={contentUploads?.businessPlan === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Concept Plan"
//             onSelectContent={() => updateContentSelection('conceptPlan')}
//             isAdded={contentUploads?.conceptPlan === 'added'}
//             isSelected={contentUploads?.conceptPlan === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Course Certification"
//             onSelectContent={() =>
//               updateContentSelection('courseCertification')
//             }
//             isAdded={contentUploads?.courseCertification === 'added'}
//             isSelected={contentUploads?.courseCertification === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Culture Charter"
//             onSelectContent={() => updateContentSelection('cultureCharter')}
//             isAdded={contentUploads?.cultureCharter === 'added'}
//             isSelected={contentUploads?.cultureCharter === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Data Set"
//             onSelectContent={() => updateContentSelection('dataSet')}
//             isAdded={contentUploads?.dataSet === 'added'}
//             isSelected={contentUploads?.dataSet === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Financial Document"
//             onSelectContent={() => updateContentSelection('financialDocument')}
//             isAdded={contentUploads?.financialDocument === 'added'}
//             isSelected={contentUploads?.financialDocument === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Focus Group Agenda and Results"
//             onSelectContent={() =>
//               updateContentSelection('focusGroupAgendaAndResults')
//             }
//             isAdded={contentUploads?.focusGroupAgendaAndResults === 'added'}
//             isSelected={
//               contentUploads?.focusGroupAgendaAndResults === 'selected'
//             }
//           />
//
//           <ContentUploadBox
//             title="Form of Communication"
//             onSelectContent={() =>
//               updateContentSelection('formOfCommunication')
//             }
//             isAdded={contentUploads?.formOfCommunication === 'added'}
//             isSelected={contentUploads?.formOfCommunication === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="I Am Video"
//             onSelectContent={() => updateContentSelection('iAmVideo')}
//             isAdded={contentUploads?.iAmVideo === 'added'}
//             isSelected={contentUploads?.iAmVideo === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Industry Analysis"
//             onSelectContent={() => updateContentSelection('industryAnalysis')}
//             isAdded={contentUploads?.industryAnalysis === 'added'}
//             isSelected={contentUploads?.industryAnalysis === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Interview Template"
//             onSelectContent={() => updateContentSelection('interviewTemplate')}
//             isAdded={contentUploads?.interviewTemplate === 'added'}
//             isSelected={contentUploads?.interviewTemplate === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Journal Entry"
//             onSelectContent={() => updateContentSelection('journalEntry')}
//             isAdded={contentUploads?.journalEntry === 'added'}
//             isSelected={contentUploads?.journalEntry === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Market Analysis"
//             onSelectContent={() => updateContentSelection('marketAnalysis')}
//             isAdded={contentUploads?.marketAnalysis === 'added'}
//             isSelected={contentUploads?.marketAnalysis === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Meeting Agenda"
//             onSelectContent={() => updateContentSelection('meetingAgenda')}
//             isAdded={contentUploads?.meetingAgenda === 'added'}
//             isSelected={contentUploads?.meetingAgenda === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Model"
//             onSelectContent={() => updateContentSelection('model')}
//             isAdded={contentUploads?.model === 'added'}
//             isSelected={contentUploads?.model === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Piece of Art"
//             onSelectContent={() => updateContentSelection('pieceOfArt')}
//             isAdded={contentUploads?.pieceOfArt === 'added'}
//             isSelected={contentUploads?.pieceOfArt === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Piece of Code"
//             onSelectContent={() => updateContentSelection('pieceOfCode')}
//             isAdded={contentUploads?.pieceOfCode === 'added'}
//             isSelected={contentUploads?.pieceOfCode === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Piece of Music"
//             onSelectContent={() => updateContentSelection('pieceOfMusic')}
//             isAdded={contentUploads?.pieceOfMusic === 'added'}
//             isSelected={contentUploads?.pieceOfMusic === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Pitch Video"
//             onSelectContent={() => updateContentSelection('pitchVideo')}
//             isAdded={contentUploads?.pitchVideo === 'added'}
//             isSelected={contentUploads?.pitchVideo === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Podcast Episode"
//             onSelectContent={() => updateContentSelection('podcastEpisode')}
//             isAdded={contentUploads?.podcastEpisode === 'added'}
//             isSelected={contentUploads?.podcastEpisode === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Project Timeline"
//             onSelectContent={() => updateContentSelection('projectTimeline')}
//             isAdded={contentUploads?.projectTimeline === 'added'}
//             isSelected={contentUploads?.projectTimeline === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Prototype Test"
//             onSelectContent={() => updateContentSelection('prototypeTest')}
//             isAdded={contentUploads?.prototypeTest === 'added'}
//             isSelected={contentUploads?.prototypeTest === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Slide Deck"
//             onSelectContent={() => updateContentSelection('slideDeck')}
//             isAdded={contentUploads?.slideDeck === 'added'}
//             isSelected={contentUploads?.slideDeck === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Social Media Content"
//             onSelectContent={() => updateContentSelection('socialMediaContent')}
//             isAdded={contentUploads?.socialMediaContent === 'added'}
//             isSelected={contentUploads?.socialMediaContent === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Sprint Template"
//             onSelectContent={() => updateContentSelection('sprintTemplate')}
//             isAdded={contentUploads?.sprintTemplate === 'added'}
//             isSelected={contentUploads?.sprintTemplate === 'selected'}
//           />
//
//           <ContentUploadBox
//             title="Survey"
//             onSelectContent={() => updateContentSelection('survey')}
//             isAdded={contentUploads?.survey === 'selected'}
//             isEnabled={contentUploads?.survey === 'added'}
//           />
//
//           <ContentUploadBox
//             title="Website"
//             onSelectContent={() => updateContentSelection('website')}
//             isAdded={contentUploads?.website === 'selected'}
//             isEnabled={contentUploads?.website === 'added'}
//           />
//         </div>
//       ) : null}
//     </div>
//   )
// }
//
// export default ContentUploads
