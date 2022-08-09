import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import image from '../../assets/images/FivePillars_no_bg.png'
import { SingleA } from './SingleA'
import { default as data } from './index'
import { Image } from './image'

const FirstDiv = () => {
  const [showImageModal, SetShowImageModal] = useState(false)

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
        <p className='video_desc mt-3'>
          Welcome to your market-ready guide. This guide is designed to walk you
          through the purpose of the market-ready page, the process of creating
          the page, and the outcomes of creating the page. Through this guide
          you will create your Market-Ready Page and submit to both your
          instructor and for final certification.
        </p>
      </div>
      <div
        className='col-12 col-md-6 image-desc ps-lg-2 px-3 px-md-0 text-center'
        // style={{ maxWidth: '500px' }}
      >
        <img
          src={image}
          style={{ maxWidth: '400px' }}
          className='w-100'
          onClick={() => SetShowImageModal('true')}
        />

        <p className='mt-2 text-center'>The Five Pillars of Assessment</p>
      </div>
      <div className='col-md-11 pe-md-5 mb-4'>
        <div className='accordion' id='accordionExample'>
          {data.map((data, index) => (
            <SingleA data={data} index={index} key={index} />
          ))}
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

export default FirstDiv
