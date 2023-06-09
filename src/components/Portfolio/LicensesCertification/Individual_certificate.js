import React, { useState } from 'react'
import avator from '../../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import DeleteModal from './deleteModal'

export default function Individual_certificate(props) {
  const [selected, setSelected] = useState(false)
  const [askBeforeDelete, setAskBefforeDelete] = useState(false)

  const updateSelect = (confirm) => {
    let data = props.data
    if (confirm) {
      props.setCertificatedToRemove((data) => [...data, props.data.id])
      setSelected(true)
    }
    if (confirm == false) {
      props.editRevmoveCertification(props.data.id)
      setSelected(false)
    }
  }
  // const removeModal=()=>{
  //   !selected
  //               ? () => {
  //                   props.setCertificatedToRemove((data) => [
  //                     ...data,
  //                     props.data.id
  //                   ])
  //                   setSelected(true)
  //                 }
  //               : () => {
  //                   props.editRevmoveCertification(props.data.id)
  //                   setSelected(false)
  //                 }
  // }
  return (
    <>
      <div
        // className='col-md-3 col-12 pb-2 col-lg-2 col-xl-2 col-xxl-2'
        style={{ width: '85%' }}
      >
        <div
          style={{ minHeight: '224px', overflow: 'hidden' }}
          className={`col-md-12 col-sm-5 col-7 mx-auto rounded text-center ${
            selected
              ? 'individual_certificate_active'
              : 'individual_certificate'
          } `}
        >
          <p
            className="w-100 float-end me-2 mt-2 text-end"
            style={{ fontSize: '16px', color: '#BBBDBF', cursor: 'pointer' }}
          >
            <span
              onClick={() => {
                selected ? updateSelect(false) : setAskBefforeDelete(true)
              }}
            >
              X
            </span>
          </p>

          {props?.data.image ? (
            <img
              src={props.data?.image ? props.data.image : avator}
              className="img-thumbnail px-md-2 py-md-0 image_of_remove"
              style={{
                borderRadius: '0px',
                border: '0px',
                width: 100,
                height: 100,
              }}
            />
          ) : (
            <>
              <div
                className="d-flex justify-content-center align-items-center img-thumbnail px-md-2 py-md-0 image_of_remove"
                style={{ width: '100%' }}
              >
                <FontAwesomeIcon
                  icon={faAward}
                  style={{
                    width: '52px',
                    height: '72px',
                    color: '#BBBDBF',
                  }}
                />
              </div>
            </>
          )}

          <p
            style={{ wordBreak: 'break-all' }}
            className="individual_certificate_text px-md-4 pt-md-2"
          >
            {props.data?.name}
          </p>
        </div>
        <DeleteModal
          show={askBeforeDelete}
          updateSelect={(confirm) => updateSelect(confirm)}
          onHide={() => {
            setAskBefforeDelete(false)
          }}
        />
      </div>
    </>
  )
}
