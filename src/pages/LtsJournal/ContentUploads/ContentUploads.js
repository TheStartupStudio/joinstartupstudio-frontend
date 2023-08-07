import React from 'react'
import ContentUploadBox from './ContentUploadBox'

const ContentUploads = ({ journal }) => {
  return (
    <div>
      {journal?.contentUploads ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px'
          }}
        >
          <ContentUploadBox
            title="Article"
            isEnabled={journal.contentUploads.article}
          />
          <ContentUploadBox
            title="Brand Chapter"
            isEnabled={journal.contentUploads.brandChapter}
          />
          <ContentUploadBox
            title="Brand Guidelines Booklet"
            isEnabled={journal.contentUploads.brandGuidelinesBooklet}
          />
          <ContentUploadBox
            title="Branded Material"
            isEnabled={journal.contentUploads.brandedMaterial}
          />
          <ContentUploadBox
            title="Brand Vehicle"
            isEnabled={journal.contentUploads.brandVehicle}
          />
          <ContentUploadBox
            title="Brand Video"
            isEnabled={journal.contentUploads.brandVideo}
          />
          <ContentUploadBox
            title="Business Plan"
            isEnabled={journal.contentUploads.businessPlan}
          />
          <ContentUploadBox
            title="Concept Plan"
            isEnabled={journal.contentUploads.conceptPlan}
          />
          <ContentUploadBox
            title="Course Certification"
            isEnabled={journal.contentUploads.courseCertification}
          />
          <ContentUploadBox
            title="Culture Charter"
            isEnabled={journal.contentUploads.cultureCharter}
          />
          <ContentUploadBox
            title="Data Set"
            isEnabled={journal.contentUploads.dataSet}
          />
          <ContentUploadBox
            title="Financial Document"
            isEnabled={journal.contentUploads.financialDocument}
          />
          <ContentUploadBox
            title="Focus Group Agenda and Results"
            isEnabled={journal.contentUploads.focusGroupAgendaAndResults}
          />
          <ContentUploadBox
            title="Form of Communication"
            isEnabled={journal.contentUploads.formOfCommunication}
          />
          <ContentUploadBox
            title="I Am Video"
            isEnabled={journal.contentUploads.iAmVideo}
          />
          <ContentUploadBox
            title="Industry Analysis"
            isEnabled={journal.contentUploads.industryAnalysis}
          />
          <ContentUploadBox
            title="Interview Template"
            isEnabled={journal.contentUploads.interviewTemplate}
          />
          <ContentUploadBox
            title="Journal Entry"
            isEnabled={journal.contentUploads.journalEntry}
          />
          <ContentUploadBox
            title="Market Analysis"
            isEnabled={journal.contentUploads.marketAnalysis}
          />
          <ContentUploadBox
            title="Meeting Agenda"
            isEnabled={journal.contentUploads.meetingAgenda}
          />
          <ContentUploadBox
            title="Model"
            isEnabled={journal.contentUploads.model}
          />
          <ContentUploadBox
            title="Piece of Art"
            isEnabled={journal.contentUploads.pieceOfArt}
          />
          <ContentUploadBox
            title="Piece of Code"
            isEnabled={journal.contentUploads.pieceOfCode}
          />
          <ContentUploadBox
            title="Piece of Music"
            isEnabled={journal.contentUploads.pieceOfMusic}
          />
          <ContentUploadBox
            title="Pitch Video"
            isEnabled={journal.contentUploads.pitchVideo}
          />
          <ContentUploadBox
            title="Podcast Episode"
            isEnabled={journal.contentUploads.podcastEpisode}
          />
          <ContentUploadBox
            title="Project Timeline"
            isEnabled={journal.contentUploads.projectTimeline}
          />
          <ContentUploadBox
            title="Prototype Test"
            isEnabled={journal.contentUploads.prototypeTest}
          />
          <ContentUploadBox
            title="Slide Deck"
            isEnabled={journal.contentUploads.slideDeck}
          />
          <ContentUploadBox
            title="Social Media Content"
            isEnabled={journal.contentUploads.socialMediaContent}
          />
          <ContentUploadBox
            title="Sprint Template"
            isEnabled={journal.contentUploads.sprintTemplate}
          />
          <ContentUploadBox
            title="Survey"
            isEnabled={journal.contentUploads.survey}
          />
          <ContentUploadBox
            title="Website"
            isEnabled={journal.contentUploads.website}
          />
        </div>
      ) : null}
    </div>
  )
}

export default ContentUploads
