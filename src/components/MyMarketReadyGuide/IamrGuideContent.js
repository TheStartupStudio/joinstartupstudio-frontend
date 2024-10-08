import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import badge1 from '../../assets/images/market-ready-1-badge.png'
import badge2 from '../../assets/images/market-ready-2-badge.png'
import image from '../../assets/images/triangle.png'
import { SingleA } from './SingleA'
import { Image } from './image'
import axiosInstance from '../../utils/AxiosInstance'
import './index.css'
import { SingleC } from './SingleC'
import { SingleD } from './SingleD'

const IamrGuideContent = () => {
  const [showImageModal, SetShowImageModal] = useState(false)
  const [data, setData] = useState([
    {
      title: 'Article',
      content:
        'A piece of writing that demonstrates your credibility, comprehension, and analytical thinking skills. This is not a summary because you have a message to communicate. Articles should include evidence/data to support all claims. '
    },
    {
      title: 'Brand Charter',
      content:
        'An overall brand strategy document and/or diagram. It shows why the brand exists and how it exists in a particular market. This charter includes: values, vision, mission, essence, positioning, promise, personality, strategies, tactics, accountability, and delivery. '
    },
    {
      title: 'Brand Guidelines Booklet',
      content:
        'An instruction manual identifying and defining the rules and standards of how a brand is represented in the market. This booklet contains: the story of the brand, logo variations, colors, typography, brand voice, imagery, and who the user/consumer is.'
    },
    {
      title: 'Branded Material',
      content:
        'Branded items that continue to tell the consistent and compelling story of the brand. These can be graphics, flyers, ads, written content, and more.'
    },
    {
      title: 'Brand Vehicle',
      content:
        'These are logos and name(s) that could potentially be copyrighted and trademarked. '
    },
    {
      title: 'Brand Video',
      content:
        'Usually a 30-75 second video that introduces or explains a key part of the brand story. It introduces the story, the values, and/or the vibe of the brand.'
    },
    {
      title: 'Business Plan',
      content:
        'A formal document that breaks down a business in terms of its operational and financial objectives. It includes: an executive summary, general company description, industry analysis, product/service overview, marketing plan, operational plan, and financial plan.'
    },
    {
      title: 'Concept Plan',
      content:
        'A short overview of a proposed project or venture, usually between 3-5 pages. It includes: a brief introduction of who you are, proof of market need based on industry and market data, explanation of the what and how of your solution, identification of the key resources necessary to execute, risk assessment, and financial and growth projections.'
    },
    {
      title: 'Course Certification',
      content:
        'A record of completion for any external course whether in-person or virtual that you completed to gain knowledge and/or skills in your field of expertise.'
    },
    {
      title: 'Culture Charter',
      content:
        'An overall culture strategy for a team, organization, or business that outlines values and behaviors expected at all levels.'
    },
    {
      title: 'Data Set',
      content: 'Collection of evidence.'
    },
    {
      title: 'Financial Document',
      content:
        'A written record of financial activity and/or performance. Some financial documents are: profit and loss statement or income statement, balance sheet, cash flow statement, and budget.'
    },
    {
      title: 'Focus Group Agenda and Results',
      content:
        'A focus group is a multiple person interview used to get feedback from specific users/consumers. The agenda has the questions and/or activities that happen during the interview, and the results are the data collected from their feedback.'
    },
    {
      title: 'Form of Communication',
      content:
        'A direct record of communication between two or more people. This can include: emails, memos, call transcripts, messages.'
    },
    {
      title: 'Personal Brand Video',
      content:
        'A personal brand video usually between 30-120 seconds long that introduces people to who you are and what you can do, including your individual value proposition.'
    },
    {
      title: 'Industry Analysis',
      content:
        'A report on a particular industry’s trends, opportunities, threats, and challenges. You should consider: what is the purpose of this analysis? What is the size of the industry? What are the trends of the industry? Who are the main competitors of the industry and how do they differentiate themselves? What is the forecast for the industry?'
    },
    {
      title: 'Interview Template',
      content:
        'A breakdown of questions asked and responses given. This can be an interview done with a member of a target market or a mentor.'
    },
    {
      title: 'Journal Entry',
      content:
        'You are importing one of your completed journal entries from any of the journals on the LTS Platform: the LTS Journal, the Wellness Journal, the Personal Finance Journal, the Leadership Journal, and/or the Market-Ready Journal.'
    },
    {
      title: 'Market Analysis',
      content:
        ' A written assessment of your target market in terms of demographics, demand, and behaviors. You should consider: What is the purpose of this analysis? Who makes up the target market? What are the behaviors of the target market? What are the experiences of the target market? What are the current strategies being used to target this market?'
    },
    {
      title: 'Meeting Agenda',
      content:
        'A written record of a meeting you led. This should include discussion items, project directives, and performance assessments.'
    },
    {
      title: 'Model',
      content:
        ' A system you have created to represent how something works. There are many types of models including: business models, growth models, financial models, and thinking models. The purpose is to demonstrate your thinking and processes.'
    },
    {
      title: 'Piece of Art',
      content:
        'if you are developing as an artist (fine arts, graphic arts, etc) these are the products you create.'
    },
    {
      title: 'Piece of Code',
      content:
        'If you are developing as a developer, these are the products you create.'
    },
    {
      title: 'Piece of Music',
      content:
        'If you are developing as a musician, singer, and/or producer, these are the products you create.'
    },
    {
      title: 'Podcast Episode',
      content:
        ' an audio recording of a podcast you have created or been a guest on.'
    },
    {
      title: 'Project Timeline',
      content:
        'a visual and/or written reference point that allows you and your team to see the process of steps to execute a project in a specific amount of time. These should include: required tasks, delegation of assignments, milestones, and potential obstacles and pivots.'
    },
    {
      title: 'Prototype/Test',
      content:
        'if you are creating a product, the prototypes are all the different versions of it and can also include the tests you conduct to determine what you need for the next iteration. '
    },
    {
      title: 'Slide Deck',
      content:
        'a visual presentation that tells the story of who you are, what you can do, and how you prove without you having to be in the room to explain it. This deck can apply to you as an individual or your project/organization/business.'
    },
    {
      title: 'Social Media Content',
      content:
        'any videos, images, or other uploads created specifically for your individual professional brand or your project/organization/business brand. '
    },
    {
      title: 'Sprint Template',
      content:
        'a sprint is a smaller project timeline. You create a sprint to achieve one task in your overall project timeline. This template shows the goal of the sprint, the actions taken in the sprint, and the results of the sprint.'
    },
    {
      title: 'Survey',
      content:
        'the documentation of questions asked and responses collected from a specific group of people.'
    },
    {
      title: 'Website',
      content:
        'the virtual pages you have created whether they are to advertise and sell a product or service, be informative, or engage users in some way.'
    },
    {
      title: 'Other',
      content:
        'you may create content that is not in the list. You can still upload it, As long as it proves the market-ready skill.'
    }
  ])

  // useEffect(() => {
  //   getMyMarketReadyData()
  // }, [])

  // const getMyMarketReadyData = async () => {
  //   await axiosInstance.get('/ltsJournals/my-market-ready').then((response) => {
  //     setData(response.data)
  //   })
  // }

  return (
    <div className='row'>
      <div className='col-12 col-md-6'>
        <div
          className='beyond-your-course-video-thumb'
          style={{ width: '100%' }}
        >
          <div>
            <ReactPlayer
              className=''
              width={'100%'}
              height={'300px'}
              url={
                // 'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-1-Introduction-to-My-Market-Ready-Guide-V2.mov'
                'https://d5tx03iw7t69i.cloudfront.net/iamr/Market Ready Guide.mov'
              }
              controls
              playing={true}
              preload='metadata'
              light={
                'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-Thumbnail.jpg'
              }
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
            />
          </div>
        </div>
        <div className='video_desc mt-3'>
          <p>
            Through your market-ready journal, you have the ability to prepare
            for the certification process. As you build your portfolio, you want
            to evaluate your growth and the proof of your growth specific to
            in-demand employability skills. The Startup Studio offers two
            market-ready certifications:
          </p>
          <div className='d-flex mt-4 align-items-center flex-column flex-sm-row'>
            <img src={badge1} alt='' style={{ width: '100px' }} />
            <p className='my-auto'>
              Market-Ready Certification 1: Competitive Entry Level
              Employability{' '}
            </p>
          </div>
          <div className='d-flex mt-4 align-items-center flex-column flex-sm-row'>
            <img src={badge2} alt='' style={{ width: '100px' }} />
            <p className='my-auto'>
              Market-Ready Certification 2: Competitive Project Management
              Employability/Self-Employment
            </p>
          </div>
          <p className='mt-4'>
            You earn these certifications by proving your proficiency in twenty
            in-demand employability skills. In-demand meaning, demanded by
            current employers. The journal allows you to evaluate your current
            level of development in each of these skills, before you submit your
            evidence to your teacher for feedback, and ultimately to The Startup
            Studio for certification.
          </p>
        </div>
      </div>
      <div className='col-12 col-md-6 cursor-pointer image-desc ps-lg-2 px-3 px-md-0 text-center'>
        <img
          src={image}
          style={{ maxWidth: '400px', marginTop: '-20px' }}
          className='w-100'
          onClick={() => SetShowImageModal('true')}
          alt='#'
        />

        <p className='mt-2 text-center'>
          Learn to Start Process to Market-Ready
        </p>
      </div>
      <div className='col-md-11 pe-md-5 mb-4'>
        <div className='accordion' id='accordionExample'>
          <SingleC
            data={data}
            index={2}
            title={'OVERVIEW OF CERTIFICATION SYSTEM'}
          />
          <SingleA
            data={data}
            index={1}
            title={'TYPES OF UPLOADS FOR SUBMISSION'}
          />
          <SingleD data={data} index={3} title={'EVALUATION SYSTEM'} />

          {/* {data?.map((data, index) => (
            <SingleA data={data} index={index} key={index} />
          ))} */}
        </div>
      </div>
      <Image
        show={showImageModal}
        onHide={() => SetShowImageModal(false)}
        file={image}
      />
    </div>
  )
}

export default IamrGuideContent
