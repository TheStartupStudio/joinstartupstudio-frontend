import { useState } from 'react'
import blueInternet from '../../assets/images/academy-icons/svg/internet-blue.svg'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import EditEduction from './EditEduction'
import DOMPurify from 'dompurify'

function PortfolioContent({
  imgSrc,
  title,
  fullText,
  link,
  institution,
  duration,
  setIsOpen,
  setOpenNew
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shortText = fullText.length > 200 ? fullText.slice(0, 200) : fullText
  return (
    <>
      <div className='d-flex gap-4 flex-col-mob'>
        <img
          src={imgSrc}
          alt={title}
          className='align-self-start portfolio-school-image'
        />
        <div className='text-black flex-grow-1'>
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='mb-0 fs-21 fw-medium'>{title}</h4>
            <img
              src={penIcon}
              className='cursor-pointer'
              alt='pen-icon'
              style={{ width: '20px' }}
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
          <p className='mb-0 fs-15 fw-medium'>{institution}</p>
          <p className='mb-0 fs-15 fw-medium'>{duration}</p>
          <div className='d-flex gap-3 align-items-center mt-2'>
            <img src={blueInternet} alt='blue-internet' />
            <a
              href={link}
              target='blank'
              className='mb-0 fs-15 blue-color fw-medium'
            >
              {link}
            </a>
          </div>
          <p
            className={`mt-3 fs-15 fw-light text-black ${
              isExpanded ? 'width-50' : ''
            }`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  isExpanded
                    ? fullText
                    : fullText.length > 200
                    ? `${shortText}...`
                    : shortText
                )
              }}
            />

            {fullText.length > 200 && (
              <span
                className='blue-color ml-2 fw-medium cursor-pointer'
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  )
}

export default PortfolioContent
