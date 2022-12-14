import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import badge1 from '../../assets/images/market-ready-1-badge.png'
import badge2 from '../../assets/images/market-ready-2-badge.png'
import image from '../../assets/images/five-pillars.jpg'
import { SingleA } from './SingleA'
import { Image } from './image'
import { useEffect } from 'react'
import axiosInstance from '../../utils/AxiosInstance'

const FirstDiv = () => {
  const [showImageModal, SetShowImageModal] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    getMyMarketReadyData()
  }, [])

  const getMyMarketReadyData = async () => {
    await axiosInstance.get('/ltsJournals/my-market-ready').then((response) => {
      setData(response.data)
    })
  }

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
                'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG_1_-_Introduction_to_My_Market-Ready_Guide.mov'
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
      <div className='col-12 col-md-6 image-desc ps-lg-2 px-3 px-md-0 text-center'>
        <img
          src={image}
          style={{ maxWidth: '400px', marginTop: '-20px' }}
          className='w-100'
          onClick={() => SetShowImageModal('true')}
          alt='#'
        />

        <p className='mt-2 text-center'>Process to market ready</p>
      </div>
      {/* <div className='col-md-11 pe-md-5 mb-4'>
        <div className='accordion' id='accordionExample'>
          {data?.map((data, index) => (
            <SingleA data={data} index={index} key={index} />
          ))}
        </div>
      </div> */}
      <Image
        show={showImageModal}
        onHide={() => SetShowImageModal(false)}
        file={image}
      />
    </div>
  )
}

export default FirstDiv
