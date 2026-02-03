import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import YourInstructor from '../LeadershipJournal/YourInstructor'
import SectionsWrapper from './SectionsWrapper'
import { NotesButton } from '../../components/Notes'
import axiosInstance from '../../utils/AxiosInstance'


function SectionTwo({ setIsReflection }) {
  const { id } = useParams()
  const [journalData, setJournalData] = useState(null)
  const [manageContentData, setManageContentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  setIsReflection(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Use dynamic ID if available (journal courses), otherwise default to 1 (leadership journal)
        const contentId = id || '1'

        // Make both API calls
        const [journalResponse, manageContentResponse] = await Promise.all([
          axiosInstance.get('/ltsJournals/1001063/'),
          axiosInstance.get(`/manage-content/${contentId}`)
        ])

        console.log('Journal API response:', journalResponse.data)
        console.log('Manage Content API response:', manageContentResponse.data)

        if (journalResponse) {
          setJournalData(journalResponse.data)
        }

        if (manageContentResponse.data.success) {
          setManageContentData(manageContentResponse.data.data)
        }

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  console.log('journalData', journalData)

  // Create paragraphs from API data
  const paragraphs = React.useMemo(() => {
    if (!journalData) return []

    const content = journalData.content || ''

    // Parse HTML content and extract text from <p> tags
    const parseHTMLParagraphs = (htmlContent) => {
      // Create a temporary DOM element to parse HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent

      // Get all <p> elements
      const pElements = tempDiv.querySelectorAll('p')

      // Extract text content from each <p> element
      return Array.from(pElements)
        .map(p => p.textContent.trim())
        .filter(text => text.length > 0)
    }

    const contentParagraphs = parseHTMLParagraphs(content)

    return contentParagraphs.map((text, index) => ({
      id: index + 1,
      text: text
    }))
  }, [journalData])

  if (loading) {
    return (
      <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
        <div className='text-center py-5'>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className='mt-3'>Loading content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
        <div className='alert alert-danger text-center py-5'>
          Error loading content: {error}
        </div>
      </div>
    )
  }

  return (
    <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
      <div className='w-100'>
        <YourInstructor
          instructorName={manageContentData?.instructorName || 'DR. Leslie Williams'}
          profilePic={manageContentData?.instructorHeadshot || 'https://s3-alpha-sig.figma.com/img/5281/edbe/057c844eb974d929552c412c8956de9c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jtzM83EbGZBWpKQXVfDBL6Z4e7mbF7eog9obL16NgkFy1KNN7Mk4V9DPFN6498GnwRXbTm1FDWSUv4oGbOZIjXHxhu6ua0xXkv7J8Hl85kQmXVPbAqJuPGmjSsQr2dAmgSuVMlO1xcUV5BRmAvBmEnqJwKAt0~xEmAj4uyfHwRLuzsxidRb4HiVSBLXR5GkjOy1U2UGM4ycTtL3IAAFjlgRhYJ1qAE06tnmkIUr6p5OkRv0djxrDClPbTaLXaBTsrlclw6vo~ApVYvcJl63UzYD4fpHA6mmi5odfvnmzT1obUqtExKlr6fXjWsthlFRRJucaEfNfEqHg0GXoHnaOpQ__'}
          userProffesion={manageContentData?.instructorTitle || 'Group Head of Social Impact and EDIB at Nord Anglia Education'}
          videoUrl={journalData?.videoId ? `https://d5tx03iw7t69i.cloudfront.net/Journal/LeadershipJournal/LJ 7 Section Two What Can I Do - V2.mov` : 'https://d5tx03iw7t69i.cloudfront.net/Journal/LeadershipJournal/LJ 7 Section Two What Can I Do - V2.mov'}
          thumbnailUrl={manageContentData?.videoThumbnail || 'https://demo-startupstudio-drive.s3.amazonaws.com/users/1972/c4c3bb86ca9d7fb7262ac58945292cda-1747042396238.jpg'}
          showInstructorInfo={false}
          customTitle="What can I do?"
        />
      </div>
      <NotesButton from="leadershipJournal"
                          data={{
                            id: journalData?.id || 1001063,
                            title: journalData?.title || 'Introduction to What can I do?'
                          }}
                          createdFrom={journalData?.title || 'Introduction to What can I do?'}
                          journalId={journalData?.id || 1001063}
                    />
      <SectionsWrapper
        title={journalData?.title || 'Introduction to What can I do?'}
        paragraphs={paragraphs}
      />
    </div>
  )
}

export default SectionTwo
