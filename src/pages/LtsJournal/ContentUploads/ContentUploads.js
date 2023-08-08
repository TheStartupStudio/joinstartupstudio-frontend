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

    console.log(contentUploadsBody)
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
    if (isSelectedContent(contentType)) {
      // if content is selected then set it to true
      handleToggleContent(contentType, true) // first argument type ex: 'article', second argument value ex: false or true
      handleDeselectContent(contentType)
    } else {
      // if content is not selected
      if (contentUploads[contentType] === true) {
        // contentUploads['article'] - gives article
        // if content is not selected and content has true value, ex: 'article': true
        // then deselect it

        handleDeselectContent(contentType)
        // and also toggle it to false: 'article': false
        handleToggleContent(contentType, false)
      } else {
        // if content is not selected and content has false value, ex: 'article': false,
        // then select it
        handleSelectContent(contentType)
      }
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
            isEnabled={contentUploads?.article}
            onSelectContent={() => updateContentSelection('article')}
            isSelected={isSelectedContent('article')}
          />

          <ContentUploadBox
            title="Brand Chapter"
            isEnabled={contentUploads?.brandChapter}
            onSelectContent={() => updateContentSelection('brandChapter')}
            isSelected={isSelectedContent('brandChapter')}
          />

          <ContentUploadBox
            title="Brand Guidelines Booklet"
            isEnabled={contentUploads?.brandGuidelinesBooklet}
            onSelectContent={() =>
              updateContentSelection('brandGuidelinesBooklet')
            }
            isSelected={isSelectedContent('brandGuidelinesBooklet')}
          />

          <ContentUploadBox
            title="Branded Material"
            isEnabled={contentUploads?.brandedMaterial}
            onSelectContent={() => updateContentSelection('brandedMaterial')}
            isSelected={isSelectedContent('brandedMaterial')}
          />

          <ContentUploadBox
            title="Brand Vehicle"
            isEnabled={contentUploads?.brandVehicle}
            onSelectContent={() => updateContentSelection('brandVehicle')}
            isSelected={isSelectedContent('brandVehicle')}
          />

          <ContentUploadBox
            title="Brand Video"
            isEnabled={contentUploads?.brandVideo}
            onSelectContent={() => updateContentSelection('brandVideo')}
            isSelected={isSelectedContent('brandVideo')}
          />

          <ContentUploadBox
            title="Business Plan"
            isEnabled={contentUploads?.businessPlan}
            onSelectContent={() => updateContentSelection('businessPlan')}
            isSelected={isSelectedContent('businessPlan')}
          />

          <ContentUploadBox
            title="Concept Plan"
            isEnabled={contentUploads?.conceptPlan}
            onSelectContent={() => updateContentSelection('conceptPlan')}
            isSelected={isSelectedContent('conceptPlan')}
          />

          <ContentUploadBox
            title="Course Certification"
            isEnabled={contentUploads?.courseCertification}
            onSelectContent={() =>
              updateContentSelection('courseCertification')
            }
            isSelected={isSelectedContent('courseCertification')}
          />

          <ContentUploadBox
            title="Culture Charter"
            isEnabled={contentUploads?.cultureCharter}
            onSelectContent={() => updateContentSelection('cultureCharter')}
            isSelected={isSelectedContent('cultureCharter')}
          />

          <ContentUploadBox
            title="Data Set"
            isEnabled={contentUploads?.dataSet}
            onSelectContent={() => updateContentSelection('dataSet')}
            isSelected={isSelectedContent('dataSet')}
          />

          <ContentUploadBox
            title="Financial Document"
            isEnabled={contentUploads?.financialDocument}
            onSelectContent={() => updateContentSelection('financialDocument')}
            isSelected={isSelectedContent('financialDocument')}
          />

          <ContentUploadBox
            title="Focus Group Agenda and Results"
            isEnabled={contentUploads?.focusGroupAgendaAndResults}
            onSelectContent={() =>
              updateContentSelection('focusGroupAgendaAndResults')
            }
            isSelected={isSelectedContent('focusGroupAgendaAndResults')}
          />

          <ContentUploadBox
            title="Form of Communication"
            isEnabled={contentUploads?.formOfCommunication}
            onSelectContent={() =>
              updateContentSelection('formOfCommunication')
            }
            isSelected={isSelectedContent('formOfCommunication')}
          />

          <ContentUploadBox
            title="I Am Video"
            isEnabled={contentUploads?.iAmVideo}
            onSelectContent={() => updateContentSelection('iAmVideo')}
            isSelected={isSelectedContent('iAmVideo')}
          />

          <ContentUploadBox
            title="Industry Analysis"
            isEnabled={contentUploads?.industryAnalysis}
            onSelectContent={() => updateContentSelection('industryAnalysis')}
            isSelected={isSelectedContent('industryAnalysis')}
          />

          <ContentUploadBox
            title="Interview Template"
            isEnabled={contentUploads?.interviewTemplate}
            onSelectContent={() => updateContentSelection('interviewTemplate')}
            isSelected={isSelectedContent('interviewTemplate')}
          />

          <ContentUploadBox
            title="Journal Entry"
            isEnabled={contentUploads?.journalEntry}
            onSelectContent={() => updateContentSelection('journalEntry')}
            isSelected={isSelectedContent('journalEntry')}
          />

          <ContentUploadBox
            title="Market Analysis"
            isEnabled={contentUploads?.marketAnalysis}
            onSelectContent={() => updateContentSelection('marketAnalysis')}
            isSelected={isSelectedContent('marketAnalysis')}
          />

          <ContentUploadBox
            title="Meeting Agenda"
            isEnabled={contentUploads?.meetingAgenda}
            onSelectContent={() => updateContentSelection('meetingAgenda')}
            isSelected={isSelectedContent('meetingAgenda')}
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
