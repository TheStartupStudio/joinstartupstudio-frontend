import { Button, Modal, ModalBody } from 'reactstrap'
import ShareModal from '../../assets/images/academy-icons/svg/share-link-modal.svg'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import { useState } from 'react'

function SharePortfolioModal({ sharePortfolio, setSharePortfolio }) {
  const [copied, setCopied] = useState(false)
  const shareLink = 'https://mystartupschool.com/aereno123290fnd-123njosa'

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset copied message after 2 seconds
    })
    setSharePortfolio((prev) => !prev)
  }
  return (
    <>
      <Modal
        isOpen={sharePortfolio}
        toggle={() => setSharePortfolio((prev) => !prev)}
      >
        <span
          className=' cursor-pointer'
          onClick={() => setSharePortfolio((prev) => !prev)}
          style={{ zIndex: '1' }}
        >
          <img className='left-arrow-modal' src={leftArrow} alt='left' />
        </span>
        <ModalBody>
          <div>
            <img
              className='modal-credit rounded-circle p-2 mb-2'
              src={ShareModal}
              alt='Credit'
            />
            <p className='mb-0 fs-15 fw-medium'>Share Link</p>
          </div>
          <p className='mt-5 text-center fw-medium'>
            This is your share link for your published portfolio. You may share
            this link with others; however, it will only work when your
            portfolio is published.
          </p>
          <p className='mt-5 text-black fs-20 text-center fw-medium'>
            {shareLink}
          </p>
          <div className='d-flex gap-3 justify-content-center mt-5 mb-3'>
            <Button color='info' className='sub-close-btn' onClick={handleCopy}>
              COPY LINK
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default SharePortfolioModal
