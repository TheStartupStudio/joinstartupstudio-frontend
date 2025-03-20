import AccordionSyllabus from './AccordionSyllabus'

function SyllabusBreakdown() {
  return (
    <section className='mt-5'>
      <h3 className='text-center text-black text-uppercase fs-27 fw-bold'>
        Your Syllabus Breakdown
      </h3>

      <div className='d-flex gap-4 mt-4'>
        <h4 className='fw-semibold fs-6 mb-0 text-nowrap text-black'>
          LEVEL 1
        </h4>
        <div>
          <h5 className='fw-semibold fs-6 text-black'>
            Entrepreneurship and You
          </h5>
          <p className='mb-0 fs-18 fw-light lh-sm text-black'>
            Entrepreneurship is a mindset, and in the first level of this
            program, you will engage in developing this mindset as your
            preparation for starting your journey on the pathway to
            entrepreneurship. You need proof of yourself as an entrepreneur and
            through this program you will create content that can publicly speak
            to your values, your purpose, your mindset, and your skillset. The
            first step in creating this proof is developing content that
            solidifies your statement of “I Am.” Who are you and how do you want
            the world to see you? It’s time for you to communicate your
            professional identity.
          </p>
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
                  Breakdown
                </button>
              </h2>
              <div
                id='collapseOne'
                className='accordion-collapse collapse'
                aria-labelledby='headingOne'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-grid gap-2'>
                  <AccordionSyllabus
                    content={'Develop your individual value proposition'}
                  />
                  <AccordionSyllabus content={'Create your I Am video'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex gap-4 mt-4'>
        <h4 className='fw-semibold fs-6 mb-0 text-nowrap text-black'>
          LEVEL 2
        </h4>
        <div>
          <h5 className='fw-semibold fs-6 text-black'>
            Understanding Learn to Start
          </h5>
          <p className='mb-0 fs-18 fw-light lh-sm text-black'>
            In the second level, you will immerse yourself in the LTS model. As
            you will soon learn succeeding in entrepreneurship might just be the
            hardest thing a person can do. By understanding all the aspects of
            the LTS model, you can begin to develop the skills and mindset that
            are needed to endure the process. Entrepreneurship begins with you.
            People want to work with people they like, respect, and trust in
            their value. So, we will begin the LTS process by challenging you to
            build yourself first. With your digital “I Am” video ready to
            introduce you to your cohort and the world, it is time to assess
            your experiences and mindset so far by evaluating yourself according
            to the LTS model and vet potential partners, thus creating a
            foundation for a successful startup.
          </p>
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
                  Breakdown
                </button>
              </h2>
              <div
                id='collapseTwo'
                className='accordion-collapse collapse'
                aria-labelledby='headingOne'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-grid gap-2'>
                  <AccordionSyllabus
                    content={'Evaluation of your mindset and skillset'}
                  />
                  <AccordionSyllabus
                    content={'Build your team and find your mentor'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex gap-4 mt-4 mb-course-syllabus'>
        <h4 className='fw-semibold fs-6 mb-0 text-nowrap text-black'>
          LEVEL 3
        </h4>
        <div>
          <div>
            <h5 className='fw-semibold fs-6 text-black'>The LEARN Stage</h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              Now that you have a better sense of self and your professional
              opportunities for collaboration, you can move on to creating the
              startup, itself. You’re going to be using your own personal
              experiences and passions to explore problems in the world that are
              worth solving. Once that hypothesis is established, you will
              engage in an analysis of that particular industry and current
              market trends that relate to your proposed problem. You’re going
              to notice that our establishment of foundational reflection will
              really pay off as you begin to construct the framework of your
              startup.
            </p>
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
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseThree'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={
                        'Identifying a problem worth solving, assumptions, and market trends'
                      }
                    />
                    <AccordionSyllabus
                      content={'Validation of your created content'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>
              The DEVELOP Stage (Part 1)
            </h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              The successful entrepreneur is a consumer of information. They are
              knowledgeable about their industry and aware of the ongoing
              behaviors of the market. Now that you have spent some time digging
              into this understanding, you can begin to build potential
              solutions to your proposed problems. And of course, the best way
              to test the efficacy of your solution is to ask the market, thus
              continuing to consume and stay informed.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseFour'
                    aria-expanded='false'
                    aria-controls='collapseFour'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseFour'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus content={'Developing your solution'} />
                    <AccordionSyllabus
                      content={'Conducting market validation for your solution'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>
              The DEVELOP Stage (Part 2)
            </h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              One of the overarching goals of this program is to thoughtfully
              craft an efficient business plan. We’re going to take a look at
              what that means by pulling together everything that you have
              learned within your project over the last couple of months. You
              will use all of that to begin developing a business model by
              drawing up a concept plan. These are just further steps on the
              journey to bringing your ideas into actualization.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseFive'
                    aria-expanded='false'
                    aria-controls='collapseFive'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseFive'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={'Developing your business model'}
                    />
                    <AccordionSyllabus content={'Writing your concept plan'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>
              The BRAND Stage (Part 1)
            </h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              There is a reason that we began this program by focusing on the
              self. Yes, knowing your own strengths and how those strengths
              might be complemented by the expertise of others is essential. But
              it’s also important to know how your identity and your passions
              are interwoven into your product development. You’re going to
              begin crafting your brand. You will then look into how the ideals
              of your brand fit into the existing market. This brand identity
              will be a guidepost to any future developments of your startup.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseSix'
                    aria-expanded='false'
                    aria-controls='collapseSix'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseSix'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={'Developing your brand charter'}
                    />
                    <AccordionSyllabus
                      content={
                        'Developing your brand architecture and vehicles'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>
              The BRAND Stage (Part 2)
            </h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              You’re beginning to see your startup take a recognizable and
              tangible shape. Your next challenge is to test the waters of the
              market. You’re going to use your market knowledge to design the
              best way to reach your desired demographics. Then, it’s time for
              more research! You need to bring the product to the people and
              collect some invaluable feedback that will, in turn, inform any
              further developments in any and all aspects of your startup.
              Remember – empowerment is about being informed.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseSeven'
                    aria-expanded='false'
                    aria-controls='collapseSeven'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseSeven'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus content={'Conducting focus groups'} />
                    <AccordionSyllabus
                      content={'Development of your marketing plan'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>START (Part 1)</h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              We have now spent some time understanding the existing market
              cultures and designing the external face of our solution. It’s
              time to focus on the internal framework. This is where your
              abstract goals and objectives become more concrete. You will break
              down the larger notions of your solution into achievable
              objectives and then test the sustainability of your plan. You
              should be noticing that your solution is beginning to evolve into
              an actionable plan.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseEight'
                    aria-expanded='false'
                    aria-controls='collapseEight'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseEight'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={
                        'Development of your Business Development Management Map'
                      }
                    />
                    <AccordionSyllabus
                      content={
                        'Testing the metric of sustainability in your plan'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>START (Part 2)</h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              As we noted at the end of last month, you should be noticing that
              your solution is beginning to evolve into an actionable plan.
              Well, guess what? It’s time to start crafting your business plan
              using all of the components you have developed over the course of
              this program. Then, you will begin testing your business plan
              using the test metrics of the Learn to Start model.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseNine'
                    aria-expanded='false'
                    aria-controls='collapseNine'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseNine'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={'Development of your business plan'}
                    />
                    <AccordionSyllabus
                      content={'Testing the metric of efficiency in your plan'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>START (Part 3)</h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              AWe’re staying the course; digging deeper and deeper into the
              pragmatic mechanics of your plan so that it becomes more and more
              tangible and actionable. Now it’s time to look at the finances.
              Once we have a solid grasp of the numbers involved in your
              startup, we can begin to look at profitability and scale while
              checking those plans against our ongoing understanding of market
              behaviors and trends.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseTen'
                    aria-expanded='false'
                    aria-controls='collapseTen'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseTen'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={'Development of your financial plan'}
                    />
                    <AccordionSyllabus
                      content={
                        'Testing the metric of profitability in your plan'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>START (Part 4)</h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              You have developed all of the workable parts of your startup and
              put it all together into an organized business plan. We can also
              begin crafting introductions to our solution and brand as we bring
              all of these working ideas into the light of day. You are now
              using everything that you have gathered and researched over
              several months to close the loop and bring your whole LTS process
              into its finality.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseEleven'
                    aria-expanded='false'
                    aria-controls='collapseEleven'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseEleven'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={'Writing of the executive summary'}
                    />
                    <AccordionSyllabus
                      content={'Creation of brand introductory video'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h5 className='fw-semibold fs-6 text-black'>START (Part 5)</h5>
            <p className='mb-0 fs-18 fw-light lh-sm text-black'>
              Every worthwhile project ends in reflection. It is a chance to
              look back on what has been accomplished, what struggles have taken
              place, and what can be improved and built upon as we continue
              forward. This is our chance to do exactly that. We will return to
              your I Am video and recraft it based on everything that you have
              developed on this journey. And, of course, we will conclude with a
              final pitch for everything that you have developed. It’s time to
              celebrate your <b>START</b>.
            </p>
            <div className='accordion mt-3' id='progressAccordion'>
              <div className='accordion-item progress-details-accordion'>
                <h2 className='accordion-header' id='headingOne'>
                  <button
                    className='accordion-button collapsed fw-medium'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseTwelve'
                    aria-expanded='false'
                    aria-controls='collapseTwelve'
                  >
                    Breakdown
                  </button>
                </h2>
                <div
                  id='collapseTwelve'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingOne'
                  data-bs-parent='#progressAccordion'
                >
                  <div className='accordion-body d-grid gap-2'>
                    <AccordionSyllabus
                      content={'Creation of your final I Am video'}
                    />
                    <AccordionSyllabus
                      content={'Development of your final pitch'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SyllabusBreakdown
