import React, { useEffect, useState } from 'react'
import ContentUploadBox from './ContentUploadBox'
import axiosInstance from '../../../utils/AxiosInstance'
import { useParams } from 'react-router-dom'

const ContentUploads = ({ journal }) => {
  const [contentUploads, setContentUploads] = useState({})

  const [selectedContent, setSelectedContent] = useState([])

  const [userContentUploads, setUserContentUploads] = useState({})

  const [userContentUploadsId, setUserContentUploadsId] = useState(0)

  function isObject(obj) {
    return !!obj
  }

  useEffect(() => {
    if (journal.contentUploads && !isObject(journal.userContentUploads)) {
      setContentUploads(journal.contentUploads)
    }
  }, [journal.contentUploads, journal.userContentUploads])
  useEffect(() => {
    if (journal.userContentUploads) {
      setContentUploads(journal.userContentUploads)
      setUserContentUploads(journal.userContentUploads)
    }
  }, [journal.userContentUploads])

  const params = useParams()
  const handleToggleContent = (name, value) => {
    const contentUploadsBody = {
      ...contentUploads,
      [name]: value
    }

    axiosInstance
      .put(
        `/contentUploads/${contentUploads.id}/userContentUploads/${
          userContentUploadsId ? userContentUploadsId : userContentUploads.id
        }/journal/${params.journalId}/`,
        contentUploadsBody
      )
      .then(({ data }) => {
        if (data) {
          setUserContentUploadsId(data.id)
          setContentUploads((contentUploads) => ({ ...contentUploads, data }))
        }
      })

    setContentUploads((contentUploads) => ({
      ...contentUploads,
      [name]: value
    }))
  }

  const handleSelectContent = (name) => {
    const newSelectedContent = [...selectedContent]
    newSelectedContent.push(name)
    setSelectedContent(newSelectedContent)
  }
  const handleDeselectContent = (contentType) => {
    const newSelectedContent = selectedContent.filter(
      (content) => content !== contentType
    )
    setSelectedContent(newSelectedContent)
  }

  const isSelectedContent = (contentType) => {
    return selectedContent.find((content) => content === contentType)
  }
  const updateContentSelection = (contentType) => {
    if (contentUploads[contentType] === 'selected') {
      handleToggleContent(contentType, 'added')
    } else if (contentUploads[contentType] === 'not_selected') {
      handleToggleContent(contentType, 'selected')
    } else if (contentUploads[contentType] === 'added') {
      handleToggleContent(contentType, 'not_selected')
    }
  }

  return (
    <div>
      {contentUploads ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          <ContentUploadBox
            title="Article"
            onSelectContent={() => updateContentSelection('article')}
            isEnabled={contentUploads?.article === 'added'}
            isSelected={contentUploads?.article === 'selected'}
          />

          <ContentUploadBox
            title="Brand Chapter"
            onSelectContent={() => updateContentSelection('brandChapter')}
            isEnabled={contentUploads?.brandChapter === 'added'}
            isSelected={contentUploads?.brandChapter === 'selected'}
          />

          <ContentUploadBox
            title="Brand Guidelines Booklet"
            onSelectContent={() =>
              updateContentSelection('brandGuidelinesBooklet')
            }
            isEnabled={contentUploads?.brandGuidelinesBooklet === 'added'}
            isSelected={contentUploads?.brandGuidelinesBooklet === 'selected'}
          />

          <ContentUploadBox
            title="Branded Material"
            onSelectContent={() => updateContentSelection('brandedMaterial')}
            isEnabled={contentUploads?.brandedMaterial === 'added'}
            isSelected={contentUploads?.brandedMaterial === 'selected'}
          />

          <ContentUploadBox
            title="Brand Vehicle"
            onSelectContent={() => updateContentSelection('brandVehicle')}
            isEnabled={contentUploads?.brandVehicle === 'added'}
            isSelected={contentUploads?.brandVehicle === 'selected'}
          />

          <ContentUploadBox
            title="Brand Video"
            onSelectContent={() => updateContentSelection('brandVideo')}
            isEnabled={contentUploads?.brandVideo === 'added'}
            isSelected={contentUploads?.brandVideo === 'selected'}
          />

          <ContentUploadBox
            title="Business Plan"
            onSelectContent={() => updateContentSelection('businessPlan')}
            isEnabled={contentUploads?.businessPlan === 'added'}
            isSelected={contentUploads?.businessPlan === 'selected'}
          />

          <ContentUploadBox
            title="Concept Plan"
            onSelectContent={() => updateContentSelection('conceptPlan')}
            isEnabled={contentUploads?.conceptPlan === 'added'}
            isSelected={contentUploads?.conceptPlan === 'selected'}
          />

          <ContentUploadBox
            title="Course Certification"
            onSelectContent={() =>
              updateContentSelection('courseCertification')
            }
            isEnabled={contentUploads?.courseCertification === 'added'}
            isSelected={contentUploads?.courseCertification === 'selected'}
          />

          <ContentUploadBox
            title="Culture Charter"
            onSelectContent={() => updateContentSelection('cultureCharter')}
            isEnabled={contentUploads?.cultureCharter === 'added'}
            isSelected={contentUploads?.cultureCharter === 'selected'}
          />

          <ContentUploadBox
            title="Data Set"
            onSelectContent={() => updateContentSelection('dataSet')}
            isEnabled={contentUploads?.dataSet === 'added'}
            isSelected={contentUploads?.dataSet === 'selected'}
          />

          <ContentUploadBox
            title="Financial Document"
            onSelectContent={() => updateContentSelection('financialDocument')}
            isEnabled={contentUploads?.financialDocument === 'added'}
            isSelected={contentUploads?.financialDocument === 'selected'}
          />

          <ContentUploadBox
            title="Focus Group Agenda and Results"
            onSelectContent={() =>
              updateContentSelection('focusGroupAgendaAndResults')
            }
            isEnabled={contentUploads?.focusGroupAgendaAndResults === 'added'}
            isSelected={
              contentUploads?.focusGroupAgendaAndResults === 'selected'
            }
          />

          <ContentUploadBox
            title="Form of Communication"
            onSelectContent={() =>
              updateContentSelection('formOfCommunication')
            }
            isEnabled={contentUploads?.formOfCommunication === 'added'}
            isSelected={contentUploads?.formOfCommunication === 'selected'}
          />

          <ContentUploadBox
            title="I Am Video"
            onSelectContent={() => updateContentSelection('iAmVideo')}
            isEnabled={contentUploads?.iAmVideo === 'added'}
            isSelected={contentUploads?.iAmVideo === 'selected'}
          />

          <ContentUploadBox
            title="Industry Analysis"
            onSelectContent={() => updateContentSelection('industryAnalysis')}
            isEnabled={contentUploads?.industryAnalysis === 'added'}
            isSelected={contentUploads?.industryAnalysis === 'selected'}
          />

          <ContentUploadBox
            title="Interview Template"
            onSelectContent={() => updateContentSelection('interviewTemplate')}
            isEnabled={contentUploads?.interviewTemplate === 'added'}
            isSelected={contentUploads?.interviewTemplate === 'selected'}
          />

          <ContentUploadBox
            title="Journal Entry"
            onSelectContent={() => updateContentSelection('journalEntry')}
            isEnabled={contentUploads?.journalEntry === 'added'}
            isSelected={contentUploads?.journalEntry === 'selected'}
          />

          <ContentUploadBox
            title="Market Analysis"
            onSelectContent={() => updateContentSelection('marketAnalysis')}
            isEnabled={contentUploads?.marketAnalysis === 'added'}
            isSelected={contentUploads?.marketAnalysis === 'selected'}
          />

          <ContentUploadBox
            title="Meeting Agenda"
            onSelectContent={() => updateContentSelection('meetingAgenda')}
            isEnabled={contentUploads?.meetingAgenda === 'added'}
            isSelected={contentUploads?.meetingAgenda === 'selected'}
          />

          <ContentUploadBox
            title="Model"
            isEnabled={contentUploads?.model}
            onSelectContent={() => updateContentSelection('model')}
            isSelected={isSelectedContent('model')}
          />

          <ContentUploadBox
            title="Piece of Art"
            isEnabled={contentUploads?.pieceOfArt}
            onSelectContent={() => updateContentSelection('pieceOfArt')}
            isSelected={isSelectedContent('pieceOfArt')}
          />

          <ContentUploadBox
            title="Piece of Code"
            isEnabled={contentUploads?.pieceOfCode}
            onSelectContent={() => updateContentSelection('pieceOfCode')}
            isSelected={isSelectedContent('pieceOfCode')}
          />

          <ContentUploadBox
            title="Piece of Music"
            isEnabled={contentUploads?.pieceOfMusic}
            onSelectContent={() => updateContentSelection('pieceOfMusic')}
            isSelected={isSelectedContent('pieceOfMusic')}
          />

          <ContentUploadBox
            title="Pitch Video"
            isEnabled={contentUploads?.pitchVideo}
            onSelectContent={() => updateContentSelection('pitchVideo')}
            isSelected={isSelectedContent('pitchVideo')}
          />

          <ContentUploadBox
            title="Podcast Episode"
            isEnabled={contentUploads?.podcastEpisode}
            onSelectContent={() => updateContentSelection('podcastEpisode')}
            isSelected={isSelectedContent('podcastEpisode')}
          />

          <ContentUploadBox
            title="Project Timeline"
            isEnabled={contentUploads?.projectTimeline}
            onSelectContent={() => updateContentSelection('projectTimeline')}
            isSelected={isSelectedContent('projectTimeline')}
          />

          <ContentUploadBox
            title="Prototype Test"
            isEnabled={contentUploads?.prototypeTest}
            onSelectContent={() => updateContentSelection('prototypeTest')}
            isSelected={isSelectedContent('prototypeTest')}
          />

          <ContentUploadBox
            title="Slide Deck"
            isEnabled={contentUploads?.slideDeck}
            onSelectContent={() => updateContentSelection('slideDeck')}
            isSelected={isSelectedContent('slideDeck')}
          />

          <ContentUploadBox
            title="Social Media Content"
            isEnabled={contentUploads?.socialMediaContent}
            onSelectContent={() => updateContentSelection('socialMediaContent')}
            isSelected={isSelectedContent('socialMediaContent')}
          />

          <ContentUploadBox
            title="Sprint Template"
            isEnabled={contentUploads?.sprintTemplate}
            onSelectContent={() => updateContentSelection('sprintTemplate')}
            isSelected={isSelectedContent('sprintTemplate')}
          />

          <ContentUploadBox
            title="Survey"
            isEnabled={contentUploads?.survey}
            onSelectContent={() => updateContentSelection('survey')}
            isSelected={isSelectedContent('survey')}
          />

          <ContentUploadBox
            title="Website"
            isEnabled={contentUploads?.website}
            onSelectContent={() => updateContentSelection('website')}
            isSelected={isSelectedContent('website')}
          />
        </div>
      ) : null}
    </div>
  )
}

export default ContentUploads
