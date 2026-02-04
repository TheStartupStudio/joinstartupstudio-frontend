import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import AccordionLead from '../../components/LeadershipJournal/AccordionLead'
import SectionsWrapper from './SectionsWrapper'
import YourInstructor from '../LeadershipJournal/YourInstructor'
import axiosInstance from '../../utils/AxiosInstance'
import parse from 'html-react-parser'

import { NotesButton } from '../../components/Notes'


function SectionOne({ setIsReflection, contentData: propContentData, lessonId }) {
  const [fetchedContentData, setFetchedContentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use prop contentData if provided, otherwise use fetched contentData
  const contentData = propContentData || fetchedContentData

  useEffect(() => {
    setIsReflection(false)
  }, [setIsReflection])

  // If no contentData prop provided, fetch it (fallback for backward compatibility)
  useEffect(() => {
    if (!propContentData) {
      setLoading(true)
      const fetchContent = async () => {
        try {
          // Use dynamic ID if available (journal courses), otherwise default to 1 (leadership journal)
          const contentId = lessonId || '1'
          const response = await axiosInstance.get(`/manage-content/${contentId}`)
          setFetchedContentData(response.data.data || response.data)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching manage-content:', error)
          setError(error.message)
          setLoading(false)
        }
      }
      fetchContent()
    }
    }, [propContentData, lessonId])
  const [openAccordion, setOpenAccordion] = useState(null)

  const renderIntroDescription = (description) => {
    if (!description) return null

    const parts = description.split('<div className=\'accordion mt-3\'')
    const textContent = parts[0]

    return (
      <>
        {textContent && parse(textContent)}

        {
          contentData?.id === 1 ? (
            <div className='accordion mt-3' id='progressAccordion'>
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingOne'>
                <button
                  className={`accordion-button fw-medium ${openAccordion !== 'one' ? 'collapsed' : ''}`}
                  type='button'
                  onClick={() => handleAccordionClick('one')}
                >
                  Section One: Who am I?
                </button>
              </h2>
              <div
                id='collapseOne'
                className={`accordion-collapse collapse ${openAccordion === 'one' ? 'show' : ''}`}
                aria-labelledby='headingOne'
              >
                <div className='accordion-body d-grid gap-2'>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Values:</span> The personal values that inform all of your decisions and must align with the organization or company you work with professionally.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Expertise:</span> The knowledge you have acquired and can apply to solve problems in a way that creates demand for your solutions.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Experience:</span> The data you have gathered based on a combination of successes and failures that have taught you how to evaluate a given situation and how to creatively and critically think as you problem-solve.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Style:</span> The way you communicate and interact with others that creates and maintains a valuable work culture.
                    </p>
                  </AccordionLead>
                </div>
              </div>
            </div>
  
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingTwo'>
                <button
                  className={`accordion-button fw-medium ${openAccordion !== 'two' ? 'collapsed' : ''}`}
                  type='button'
                  onClick={() => handleAccordionClick('two')}
                >
                  Section Two: What can I do?
                </button>
              </h2>
              <div
                id='collapseTwo'
                className={`accordion-collapse collapse ${openAccordion === 'two' ? 'show' : ''}`}
                aria-labelledby='headingTwo'
              >
                <div className='accordion-body d-grid gap-2'>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Teamwork:</span> The working relationships you build with others to create outcomes.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Initiative:</span> The ability to take a risk and start something new to create outcomes.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Methodology:</span> The processes you utilize to create outcomes.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Self-Assessment:</span> The evaluation system you use to give yourself transparency around the success and failure of creating outcomes.
                    </p>
                  </AccordionLead>
                </div>
              </div>
            </div>
  
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingThree'>
                <button
                  className={`accordion-button fw-medium ${openAccordion !== 'three' ? 'collapsed' : ''}`}
                  type='button'
                  onClick={() => handleAccordionClick('three')}
                >
                  Section Three: How do I prove it?
                </button>
              </h2>
              <div
                id='collapseThree'
                className={`accordion-collapse collapse ${openAccordion === 'three' ? 'show' : ''}`}
                aria-labelledby='headingThree'
              >
                <div className='accordion-body d-grid gap-2'>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Outcomes:</span> The solutions you create to solve problems.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Feedback:</span> The response from your team and market concerning the outcomes you create.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Iteration:</span> The use of failure and feedback to pivot as you create and modify outcomes.
                    </p>
                  </AccordionLead>
                  <AccordionLead>
                    <p className='fs-15 fw-light'>
                      <span className='fw-medium'>Vision:</span> The ability to project forward in the context of the markets you serve.
                    </p>
                  </AccordionLead>
                </div>
              </div>
            </div>
          </div>
          ) : (null)

        }
      </>
    )
  }

  const handleAccordionClick = (accordionId) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId)
  }


  if (loading) {
    return (
      <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
        <div className='w-100 d-flex justify-content-center align-items-center' style={{ minHeight: '200px' }}>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
        <div className='w-100'>
          <div className='alert alert-danger' role='alert'>
            Error loading content: {error}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className='leadership-layout d-grid gap-5 grid-col-1-mob '>
      <div className='w-100'>
        <div className='row'>
          <div className='col-12 mb-4'>
            <YourInstructor
              instructorName={contentData?.instructorName || 'DR. Leslie Williams'}
              profilePic={contentData?.instructorHeadshot || 'https://s3-alpha-sig.figma.com/img/5281/edbe/057c844eb974d929552c412c8956de9c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jtzM83EbGZBWpKQXVfDBL6Z4e7mbF7eog9obL16NgkFy1KNN7Mk4V9DPFN6498GnwRXbTm1FDWSUv4oGbOZIjXHxhu6ua0xXkv7J8Hl85kQmXVPbAqJuPGmjSsQr2dAmgSuVMlO1xcUV5BRmAvBmEnqJwKAt0~xEmAj4uyfHwRLuzsxidRb4HiVSBLXR5GkjOy1U2UGM4ycTtL3IAAFjlgRhYJ1qAE06tnmkIUr6p5OkRv0djxrDClPbTaLXaBTsrlclw6vo~ApVYvcJl63UzYD4fpHA6mmi5odfvnmzT1obUqtExKlr6fXjWsthlFRRJucaEfNfEqHg0GXoHnaOpQ__'}
              userProffesion={contentData?.instructorTitle?.trim() || 'Group Head of Social Impact and EDIB at Nord Anglia Education'}
              videoUrl={contentData?.videoUrl || 'https://d5tx03iw7t69i.cloudfront.net/Journal/LeadershipJournal/LJ 1 Welcome - V2.mov'}
              thumbnailUrl={contentData?.videoThumbnail || "https://demo-startupstudio-drive.s3.amazonaws.com/users/1972/7f7eacb5dc6062f030423b07485c8d75-1747040586324.jpg"}
            />
          </div>
        </div>
      </div>
      <SectionsWrapper
        title={contentData?.introTitle || 'Welcome to the Leadership Journal'}
      >
        {contentData?.introDescription ? (
          renderIntroDescription(contentData.introDescription)
        ) : (
          <div>
            <p className='fs-16 fw-light lh-base mt-4'>
              Welcome to your Leadership Journal. A leader is someone who can utilize their own agency to manage the agency of others towards a shared vision. Leadership is not a defined set of inflexible character traits or abilities, rather it is the ability to confidently take action that resonates with and impacts the work of others. There is a leader version of you that you will unlock and develop through this program and within this journal. The leader version of you can be expressed in the market in a multitude of ways. You can be a leader in your field of expertise - someone who is depended on for their knowledge and experience to help a team make decisions. You can be a leader of a project-based team - someone who devises and executes a timeline of work and the delegation of responsibilities of team members. You can be the leader of an organization or company - someone who is aware of the macro viewpoint while hiring and guiding the work of others at a micro level. But, throughout these different roles of leader, you must always be the leader of yourself. Leading yourself first means knowing who you are, what you can do, and how you prove it.
            </p>
            <p className='fs-16 fw-light lh-base mt-3'>
              As you develop into the leader version of yourself, you will create more substance to inform how you communicate your unique value proposition, you will demonstrate your leadership outcomes in your Market-Ready Portfolio, and you will engage in opportunities to develop the specific market-ready skills evaluated in the LTS Certification process. You have the space to reflect as you become a more capable and effective leader in this journal. This journal is separated into three sections based on the three foundational questions of this program:
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className={`accordion-button fw-medium ${openAccordion !== 'one' ? 'collapsed' : ''}`}
                    type='button'
                    onClick={() => handleAccordionClick('one')}
                  >
                    Section One: Who am I?
                  </button>
                </h2>
                <div
                  id='collapseOne'
                  className={`accordion-collapse collapse ${openAccordion === 'one' ? 'show' : ''}`}
                  aria-labelledby='headingOne'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Values:</span> The personal values that inform all of your decisions and must align with the organization or company you work with professionally.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Expertise:</span> The knowledge you have acquired and can apply to solve problems in a way that creates demand for your solutions.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Experience:</span> The data you have gathered based on a combination of successes and failures that have taught you how to evaluate a given situation and how to creatively and critically think as you problem-solve.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Style:</span> The way you communicate and interact with others that creates and maintains a valuable work culture.
                      </p>
                    </AccordionLead>
                  </div>
                </div>
              </div>

              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingTwo'>
                  <button
                    className={`accordion-button fw-medium ${openAccordion !== 'two' ? 'collapsed' : ''}`}
                    type='button'
                    onClick={() => handleAccordionClick('two')}
                  >
                    Section Two: What can I do?
                  </button>
                </h2>
                <div
                  id='collapseTwo'
                  className={`accordion-collapse collapse ${openAccordion === 'two' ? 'show' : ''}`}
                  aria-labelledby='headingTwo'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Teamwork:</span> The working relationships you build with others to create outcomes.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Initiative:</span> The ability to take a risk and start something new to create outcomes.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Methodology:</span> The processes you utilize to create outcomes.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Self-Assessment:</span> The evaluation system you use to give yourself transparency around the success and failure of creating outcomes.
                      </p>
                    </AccordionLead>
                  </div>
                </div>
              </div>

              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingThree'>
                  <button
                    className={`accordion-button fw-medium ${openAccordion !== 'three' ? 'collapsed' : ''}`}
                    type='button'
                    onClick={() => handleAccordionClick('three')}
                  >
                    Section Three: How do I prove it?
                  </button>
                </h2>
                <div
                  id='collapseThree'
                  className={`accordion-collapse collapse ${openAccordion === 'three' ? 'show' : ''}`}
                  aria-labelledby='headingThree'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Outcomes:</span> The solutions you create to solve problems.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Feedback:</span> The response from your team and market concerning the outcomes you create.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Iteration:</span> The use of failure and feedback to pivot as you create and modify outcomes.
                      </p>
                    </AccordionLead>
                    <AccordionLead>
                      <p className='fs-15 fw-light'>
                        <span className='fw-medium'>Vision:</span> The ability to project forward in the context of the markets you serve.
                      </p>
                    </AccordionLead>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <NotesButton
          from="leadershipJournal"
          data={{
            id: contentData?.id || parseInt(lessonId) || 1001061,
            title: contentData?.introTitle || 'Welcome to the Leadership Journal'
          }}
          createdFrom={contentData?.introTitle || 'Welcome to the Leadership Journal'}
          journalId={contentData?.id || parseInt(lessonId) || 1001061}
        />
        
      </SectionsWrapper>
    </div>
  )
}

export default SectionOne
