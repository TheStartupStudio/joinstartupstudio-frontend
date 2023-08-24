import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import { NewJournalBrandModal } from '../../../components/Modals/JournalBrands/NewJournalBrandModal'
import { useState } from 'react'
import { EditJournalBrandImageModal } from '../../../components/Modals/JournalBrands/EditJournalBrandImageModal'
import { EditJournalBrandBoxModal } from '../../../components/Modals/JournalBrands/EditJournalBrandBoxModal'
import axiosInstance from '../../../utils/AxiosInstance'

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
    await axiosInstance
      .delete(`/LtsJournals/journal-brand/${id}`)
      .then(() => props.loadData())
  }

  return (
    <div className="journal_brands--wrapper">
      <div className="row">
        {props.brands
          .filter((brand) => !brand.isDefault)
          .map((brand) => (
            <div className="col-12 col-sm-6 col-md-4">
              <div className="brand__item">
                {props.hasActions && (
                  <span
                    className="remove-brand-item"
                    onClick={(e) => deleteBrand(brand.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="edit-modal-sm ms-4"
                    />
                  </span>
                )}
                <img
                  onClick={
                    props.hasActions
                      ? () => {
                          setImage(brand.image)
                          setBrandId(brand.id)
                          setShowEditJournalBrandImageModal(true)
                        }
                      : undefined
                  }
                  className="journal__image"
                  src={brand.image}
                  alt=""
                  style={!props.hasActions && { cursor: 'default' }}
                />
                <div
                  className="brand__box"
                  onClick={
                    props.hasActions
                      ? (e) => {
                          setColumn('type')
                          setBrandId(brand.id)
                          setContent(brand.type)
                          setShowEditJournalBrandBoxModal(true)
                        }
                      : undefined
                  }
                  dangerouslySetInnerHTML={{
                    __html: `<strong>TYPE OF SHOT:</strong> ${brand.type}`
                  }}
                  style={!props.hasActions && { cursor: 'default' }}
                ></div>
                <div
                  className="brand__box"
                  onClick={
                    props.hasActions
                      ? (e) => {
                          setColumn('action')
                          setBrandId(brand.id)
                          setContent(brand.action)
                          setShowEditJournalBrandBoxModal(true)
                        }
                      : undefined
                  }
                  dangerouslySetInnerHTML={{
                    __html: `<strong>ACTION:</strong> ${brand.action}`
                  }}
                  style={!props.hasActions && { cursor: 'default' }}
                ></div>
                <div
                  className="brand__box"
                  onClick={
                    props.hasActions
                      ? (e) => {
                          setColumn('narration')
                          setBrandId(brand.id)
                          setContent(brand.narration)
                          setShowEditJournalBrandBoxModal(true)
                        }
                      : undefined
                  }
                  dangerouslySetInnerHTML={{
                    __html: `<strong>NARRATION:</strong> ${brand.narration}`
                  }}
                  style={!props.hasActions && { cursor: 'default' }}
                ></div>
                <div
                  className="brand__box"
                  onClick={
                    props.hasActions
                      ? (e) => {
                          setColumn('music')
                          setBrandId(brand.id)
                          setContent(brand.music)
                          setShowEditJournalBrandBoxModal(true)
                        }
                      : undefined
                  }
                  dangerouslySetInnerHTML={{
                    __html: `<strong>MUSIC:</strong> ${brand.music}`
                  }}
                  style={!props.hasActions && { cursor: 'default' }}
                ></div>
              </div>
            </div>
          ))}
        <div className="col-12">
          {props.hasActions && (
            <a
              className="add-new-brand"
              onClick={(e) => setShowNewJournalModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add another full section of Image and the boxes below it
            </a>
          )}

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
    </div>
  )
}

export default JournalBrands
