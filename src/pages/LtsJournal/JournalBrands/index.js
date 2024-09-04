import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import { NewJournalBrandModal } from '../../../components/Modals/JournalBrands/NewJournalBrandModal'
import { useState } from 'react'
import { EditJournalBrandImageModal } from '../../../components/Modals/JournalBrands/EditJournalBrandImageModal'
import { EditJournalBrandBoxModal } from '../../../components/Modals/JournalBrands/EditJournalBrandBoxModal'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const JournalBrands = (props) => {
  const [showNewJournalModal, setShowNewJournalModal] = useState(false)
  const [showEditJournalBrandImageModal, setShowEditJournalBrandImageModal] =
    useState(false)
  const [showEditJournalBrandBoxModal, setShowEditJournalBrandBoxModal] =
    useState(false)
  const [brandId, setBrandId] = useState(null)
  const [image, setImage] = useState(null)
  const [column, setColumn] = useState(null)
  const [content, setContent] = useState(null)

  const deleteBrand = async (id) => {
    await axiosInstance.delete(`/LtsJournals/journal-brand/${id}`).then(() => {
      toast.success('Brand removed successfully!')
      props.loadData()
    })
  }

  return (
    <div className='journal_brands--wrapper'>
      <div className='row brand-video-container'>
        {props.brands
          .filter((brand) => !brand.isDefault)
          .map((brand) => (
            // <div className='col-12 col-sm-6 col-md-4'>
            <div
              className='col-12 col-sm-6 brand-items-container'
              style={{
                width: '100%'
              }}
            >
              <div className='brand__item'>
                <span
                  className='remove-brand-item cursor-pointer'
                  onClick={(e) => deleteBrand(brand.id)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className='edit-modal-sm ms-4'
                  />
                </span>
                <img
                  onClick={() => {
                    setImage(brand.image)
                    setBrandId(brand.id)
                    setShowEditJournalBrandImageModal(true)
                  }}
                  className='journal__image'
                  src={brand.image}
                  alt=''
                />
                <div
                  className='brand__box'
                  onClick={(e) => {
                    setColumn('type')
                    setBrandId(brand.id)
                    setContent(brand.type)
                    setShowEditJournalBrandBoxModal(true)
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<span class='brand-title'>TYPE OF SHOT:</span>&nbsp;${brand.type}`
                  }}
                ></div>
                <div
                  className='brand__box'
                  onClick={(e) => {
                    setColumn('action')
                    setBrandId(brand.id)
                    setContent(brand.action)
                    setShowEditJournalBrandBoxModal(true)
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<span class='brand-title'>ACTION:</span>&nbsp;${brand.action}`
                  }}
                ></div>
                <div
                  className='brand__box mar-btm-p'
                  onClick={(e) => {
                    setColumn('narration')
                    setBrandId(brand.id)
                    setContent(brand.narration)
                    setShowEditJournalBrandBoxModal(true)
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<span class='brand-title'>NARRATION:</span>&nbsp;${brand.narration}`
                  }}
                ></div>
                <div
                  className='brand__box'
                  onClick={(e) => {
                    setColumn('music')
                    setBrandId(brand.id)
                    setContent(brand.music)
                    setShowEditJournalBrandBoxModal(true)
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<span class='brand-title'>MUSIC:</span>&nbsp;<span class="lizas-text">${brand.music}</span>`
                  }}
                ></div>
              </div>
            </div>
          ))}
      </div>
      <div className='col-12 my-3'>
        <a
          className='add-new-brand cursor-pointer'
          onClick={(e) => setShowNewJournalModal(true)}
          href
        >
          <FontAwesomeIcon icon={faPlus} className='me-2 icon-plus' />
          Add another full section of Image and the boxes below it
        </a>
        <NewJournalBrandModal
          hasAccordion={props.hasAccordion}
          onShow={() => {
            props.loadData()
            setShowNewJournalModal(false)
          }}
          onHide={() => {
            setShowNewJournalModal(false)
          }}
          show={showNewJournalModal}
          journalId={props.journalId}
        />
        <EditJournalBrandImageModal
          onShow={() => {
            props.loadData()
            setShowEditJournalBrandImageModal(false)
          }}
          onHide={() => {
            setShowEditJournalBrandImageModal(false)
          }}
          show={showEditJournalBrandImageModal}
          journalId={props.journalId}
          image={image}
          id={brandId}
        />
        <EditJournalBrandBoxModal
          onShow={() => {
            props.loadData()
            setShowEditJournalBrandBoxModal(false)
          }}
          onHide={() => {
            setShowEditJournalBrandBoxModal(false)
          }}
          show={showEditJournalBrandBoxModal}
          journalId={props.journalId}
          id={brandId}
          column={column}
          content={content}
        />
      </div>
    </div>
  )
}

export default JournalBrands
