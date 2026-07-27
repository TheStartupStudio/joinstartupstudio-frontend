import { Button, Modal, ModalBody } from 'reactstrap'
import ShareModal from '../../assets/images/academy-icons/svg/share-link-modal.svg'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import { useState } from 'react'
import { toast } from 'react-toastify'

function SharePortfolioModal({ sharePortfolio, setSharePortfolio, portfolioUrl }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
      setSharePortfolio(false)
    } catch (err) {
      toast.error('Failed to copy link')
      console.error('Copy failed:', err)
    }
  }

  return (
    <>
      <Modal
        isOpen={sharePortfolio}
        toggle={() => setSharePortfolio(false)}
      >
        <span
          className='cursor-pointer'
          onClick={() => setSharePortfolio(false)}
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
            <a 
              href={portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#51c7df',
                textDecoration: 'none',
                wordBreak: 'break-all'
              }}
            >
              {portfolioUrl}
            </a>
          </p>
          <div className='d-flex gap-3 justify-content-center mt-5 mb-3'>
            <Button
              color='info'
              className='sub-close-btn'
              onClick={handleCopy}
            >
              {copied ? 'COPIED!' : 'COPY LINK'}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default SharePortfolioModal
