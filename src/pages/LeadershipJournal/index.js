import React, { useState } from 'react'
import Select from 'react-select'
import IntlMessages from '../../utils/IntlMessages'
import ModalInput from '../../components/ModalInput/ModalInput'
import searchJ from '../../assets/images/academy-icons/search.png'
import SelectCourses from '../../components/LeadershipJournal/SelectCourses'
import YourInstructor from '../../components/LeadershipJournal/YourInstructor'
import WhoAmI from '../../assets/images/academy-icons/WhoAmI.png'
import AccordionSyllabus from '../../components/WelcomeToCourse/AccordionSyllabus'
import AccordionLead from '../../components/LeadershipJournal/AccordionLead'

function LeadershipJournal() {
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [activeTab, setActiveTab] = useState('Section One: Who am I?')

  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
    console.log('Selected Language:', selectedOption.value)
  }

  const tabs = [
    'Section One: Who am I?',
    'Section Two: What can I do?',
    'Section Three: How do I prove it?'
  ]

  const paragraphs = [
    {
      id: 1,
      text: 'Welcome to your Leadership Journal. A leader is someone who can utilize their own agency to manage the agency of others towards a shared vision. Leadership is not a defined set of inflexible character traits or abilities, rather it is the ability to confidently take action that resonates with and impacts the work of others. There is a leader version of you that you will unlock and develop through this program and within this journal. The leader version of you can be expressed in the market in a multitude of ways. You can be a leader in your field of expertise - someone who is depended on for their knowledge and experience to help a team make decisions. You can be a leader of a project-based team - someone who devises and executes a timeline of work and the delegation of responsibilities of team members. You can be the leader of an organization or company - someone who is aware of the macro viewpoint while hiring and guiding the work of others at a micro level. But, throughout these different roles of leader, you must always be the leader of yourself. Leading yourself first means knowing who you are, what you can do, and how you prove it. '
    },
    {
      id: 2,
      text: 'As you develop into the leader version of yourself, you will create more substance to inform how you communicate your unique value proposition, you will demonstrate your leadership outcomes in your Market-Ready Portfolio, and you will engage in opportunities to develop the specific market-ready skills evaluated in the LTS Certification process. You have the space to reflect as you become a more capable and effective leader in this journal. This journal is separated into three sections based on the three foundational questions of this program:'
    }
  ]

  const sectionOne = [
    {
      id: 1,
      title: 'Values:',
      description:
        'The personal values that inform all of your decisions and must align with the organization or company you work with professionally.'
    },
    {
      id: 2,
      title: 'Expertise:',
      description:
        'The knowledge you have acquired and can apply to solve problems in a way that creates demand for your solutions.'
    },
    {
      id: 3,
      title: 'Experience:',
      description:
        'The data you have gathered based on a combination of successes and failures that have taught you how to evaluate a given situation and how to creatively and critically think as you problem-solve.'
    },
    {
      id: 4,
      title: 'Style:',
      description:
        'The way you communicate and interact with others that creates and maintains a valuable work culture.'
    }
  ]

  const sectionTwo = [
    {
      id: 1,
      title: 'Teamwork:',
      description:
        'The working relationships you build with others to create outcomes.'
    },
    {
      id: 2,
      title: 'Initiative:',
      description:
        'The ability to take a risk and start something new to create outcomes.'
    },
    {
      id: 3,
      title: 'Methodology:',
      description: 'The processes you utilize to create outcomes.'
    },
    {
      id: 4,
      title: 'Self-Assessment:',
      description:
        'The evaluation system you use to give yourself transparency around the success and failure of creating outcomes.'
    }
  ]

  const sectionThree = [
    {
      id: 1,
      title: 'Outcomes:',
      description: 'The solutions you create to solve problems.'
    },
    {
      id: 2,
      title: 'Feedback:',
      description:
        'The response from your team and market concerning the outcomes you create.'
    },
    {
      id: 3,
      title: 'Iteration:',
      description:
        'The use of failure and feedback to pivot as you create and modify outcomes.'
    },
    {
      id: 4,
      title: 'Vision:',
      description:
        'The ability to project forward in the context of the markets you serve.'
    }
  ]

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0'>
          <div className='account-page-padding d-flex justify-content-between align-items-center'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-2'>
                <IntlMessages id='journal.header' />
              </h3>
              <p className='mb-0 fs-13 fw-light text-black'>
                Leadership comes in many forms but the foundation is leading
                yourself first. Use this journal to inspire your development as
                a leader.
              </p>
            </div>

            <div
              style={{
                display: 'inline-block',
                borderRadius: '8px',
                background:
                  'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                padding: '1px', // Adjust this value to control border thickness
                height: '58px',
                boxShadow: '0px 4px 10px 0px #00000040'
              }}
            >
              <Select
                options={options}
                value={selectedLanguage}
                onChange={handleChange}
                placeholder='Select Language'
                menuPortalTarget={document.body}
                isSearchable={false}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    width: '250px', // Fixed width
                    minHeight: '40px', // Fixed height
                    overflow: 'hidden',
                    border: 'none', // Remove the default border
                    borderRadius: '6px' // Slightly smaller than the outer container radius
                  }),
                  singleValue: (base) => ({
                    ...base,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  })
                }}
                components={{
                  IndicatorSeparator: () => null // Remove separator
                }}
              />
            </div>
          </div>
        </div>
        <div className='academy-dashboard-layout lead-class mb-5'>
          <div className='course-experts d-flex'>
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`fs-14 fw-medium text-center p-2 cursor-pointer col-4 ${
                  activeTab === tab ? 'active-leadership' : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className='mt-4 d-flex justify-content-between'>
            <div className='col-5'>
              <ModalInput
                id={'searchBar'}
                type={'search'}
                labelTitle={'Search journals'}
                imgSrc={searchJ}
                imageStyle={{ filter: 'grayscale(1)' }}
              />
            </div>
            <SelectCourses />
          </div>
          <div>
            <div className='d-flex mt-4 gap-5'>
              <div className='col-4'>
                <YourInstructor
                  instructorName={'DR. Leslie Williams'}
                  profilePic={
                    'https://s3-alpha-sig.figma.com/img/5281/edbe/057c844eb974d929552c412c8956de9c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jtzM83EbGZBWpKQXVfDBL6Z4e7mbF7eog9obL16NgkFy1KNN7Mk4V9DPFN6498GnwRXbTm1FDWSUv4oGbOZIjXHxhu6ua0xXkv7J8Hl85kQmXVPbAqJuPGmjSsQr2dAmgSuVMlO1xcUV5BRmAvBmEnqJwKAt0~xEmAj4uyfHwRLuzsxidRb4HiVSBLXR5GkjOy1U2UGM4ycTtL3IAAFjlgRhYJ1qAE06tnmkIUr6p5OkRv0djxrDClPbTaLXaBTsrlclw6vo~ApVYvcJl63UzYD4fpHA6mmi5odfvnmzT1obUqtExKlr6fXjWsthlFRRJucaEfNfEqHg0GXoHnaOpQ__'
                  }
                  userProffesion={
                    'Group Head of Social Impact and EDIB at Nord Anglia Education'
                  }
                />
              </div>
              <div className='p-4 register-section w-100'>
                <div className='d-flex gap-3 align-items-center'>
                  <img src={WhoAmI} alt='who-am-i' />
                  <h4 className='fs-18 my-details-header text-black'>
                    Welcome to the Leadership Journal
                  </h4>
                </div>
                <div className='mt-5 fs-18 fw-light text-black'>
                  {paragraphs.map((item) => (
                    <p className='lh-sm' key={item.id}>
                      {item.text}
                    </p>
                  ))}
                  <div className='accordion mt-3' id='progressAccordion'>
                    <div className='accordion-item progress-details-accordion'>
                      <h2 className='accordion-header' id='headingOne'>
                        <button
                          className='accordion-button collapsed fw-medium'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target='#collapseOne'
                          aria-expanded='false'
                          aria-controls='collapseOne'
                        >
                          Section One: Who am I?
                        </button>
                      </h2>
                      <div
                        id='collapseOne'
                        className='accordion-collapse collapse'
                        aria-labelledby='headingOne'
                        data-bs-parent='#progressAccordion'
                      >
                        <div className='accordion-body d-grid gap-2'>
                          {sectionOne.map((item) => (
                            <AccordionLead key={item.id}>
                              <p className='fs-15 fw-light'>
                                <span className='fw-medium'>{item.title}</span>{' '}
                                {item.description}
                              </p>
                            </AccordionLead>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='accordion mt-3' id='progressAccordion'>
                    <div className='accordion-item progress-details-accordion'>
                      <h2 className='accordion-header' id='headingOne'>
                        <button
                          className='accordion-button collapsed fw-medium'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target='#collapseTwo'
                          aria-expanded='false'
                          aria-controls='collapseTwo'
                        >
                          Section Two: What can I do?
                        </button>
                      </h2>
                      <div
                        id='collapseTwo'
                        className='accordion-collapse collapse'
                        aria-labelledby='headingOne'
                        data-bs-parent='#progressAccordion'
                      >
                        <div className='accordion-body d-grid gap-2'>
                          {sectionTwo.map((item) => (
                            <AccordionLead key={item.id}>
                              <p className='fs-15 fw-light'>
                                <span className='fw-medium'>{item.title}</span>{' '}
                                {item.description}
                              </p>
                            </AccordionLead>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='accordion mt-3' id='progressAccordion'>
                    <div className='accordion-item progress-details-accordion'>
                      <h2 className='accordion-header' id='headingOne'>
                        <button
                          className='accordion-button collapsed fw-medium'
                          type='button'
                          data-bs-toggle='collapse'
                          data-bs-target='#collapseThree'
                          aria-expanded='false'
                          aria-controls='collapseThree'
                        >
                          Section Three: How do I prove it?
                        </button>
                      </h2>
                      <div
                        id='collapseThree'
                        className='accordion-collapse collapse'
                        aria-labelledby='headingOne'
                        data-bs-parent='#progressAccordion'
                      >
                        <div className='accordion-body d-grid gap-2'>
                          {sectionThree.map((item) => (
                            <AccordionLead key={item.id}>
                              <p className='fs-15 fw-light'>
                                <span className='fw-medium'>{item.title}</span>{' '}
                                {item.description}
                              </p>
                            </AccordionLead>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadershipJournal
