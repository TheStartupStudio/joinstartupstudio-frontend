import { v4 as uuidv4 } from 'uuid'
import React, { useEffect, useState } from 'react'
import KendoTextEditor from '../TextEditor'
import PositionSelector from '../../PositionSelector/PositionSelector'
import Checkboxes from '../Checkboxes'
import ParagraphInputs from './ParagraphInputs'
import OrderInput from './OrderInput'
import TextEditorInputs from './TextEditorInputs'
import PopupButtonInputs from './PopupButtonInputs'

const CustomContent = (props) => {
  const [sortedComponents, setSortedComponents] = useState([])

  const handleEditCheckboxes = (e, checkBoxIndex) => {
    props.handleChangeCheckboxes(
      'checkboxesData',
      e,
      checkBoxIndex,
      props.breakdownIndex
    )
  }
  useEffect(() => {
    if (props.breakdown?.customContent) {
      const checkboxesDataCopy =
        props.breakdown?.customContent?.checkboxesData?.slice() || []
      const textEditorDataCopy =
        props.breakdown?.customContent?.textEditorData?.slice() || []
      const paragraphsCopy =
        props.breakdown?.customContent?.paragraphs?.slice() || []
      const buttonsCopy = props.breakdown?.customContent?.buttons?.slice() || []
      const popupButtonsCopy =
        props.breakdown?.customContent?.popupButtons?.slice() || []
      const imagesCopy = props.breakdown?.customContent?.images?.slice() || []
      const imageGalleryCopy =
        props.breakdown?.customContent?.imageGallery || {}
      setSortedComponents(
        [
          ...checkboxesDataCopy,
          ...textEditorDataCopy,
          ...paragraphsCopy,
          ...buttonsCopy,
          ...imagesCopy,
          ...popupButtonsCopy,
          imageGalleryCopy
        ].sort((a, b) => a.order - b.order)
      )
    }
  }, [
    props.breakdown?.customContent?.paragraphs?.length,
    props.breakdown?.customContent?.checkboxesData?.length,
    props.breakdown?.customContent?.textEditorData?.length,
    props.breakdown?.customContent?.buttons?.length,
    props.breakdown?.customContent?.popupButtons?.length,
    props.breakdown?.customContent?.images?.length,
    props.breakdown?.customContent?.imageGallery?.images?.length,
    props.breakdown?.customContent?.paragraphs,
    props.breakdown?.customContent?.checkboxesData,
    props.breakdown?.customContent?.textEditorData,
    props.breakdown?.customContent?.buttons,
    props.breakdown?.customContent?.popupButtons,
    props.breakdown?.customContent?.images,
    props.breakdown?.customContent?.imageGallery?.images,
    props.breakdown?.customContent?.imageGallery?.position,
    props.breakdown?.customContent?.imageGallery,

    JSON.stringify(
      props.breakdown?.customContent?.images?.map((image) => image.button)
    ),
    JSON.stringify(
      props.breakdown?.customContent?.imageGallery?.images?.map(
        (image) => image.button
      )
    )
  ])

  const handleOrderChange = (index, newOrder) => {
    const selectedItem = sortedComponents[index]
    const newData = [...sortedComponents]
    newData.splice(index, 1)
    newData.splice(newOrder - 1, 0, selectedItem)
    const updatedData = newData.map((item, index) => {
      item.order = index + 1
      return item
    })
    setSortedComponents(updatedData)
  }

  const [gridColumns, setGridColumns] = useState(4)
  const [imageGalleryUUID, setImageGalleryIndexUUID] = useState(null)

  const handleChangeGridValues = (value, uuid) => {
    setGridColumns(value)
    setImageGalleryIndexUUID(uuid)
  }

  useEffect(() => {
    props.handleChangeGridColumns(gridColumns, imageGalleryUUID)
  }, [gridColumns])

  const firstImageUUID = sortedComponents?.filter(
    (sc) => sc?.type === 'image'
  )[0]?.uuid
  const firstImageUUIDIndex = sortedComponents?.findIndex(
    (sc) => sc?.uuid === firstImageUUID
  )

  // const [buttonImage, setButtonImage] = useState()
  // console.log(buttonImage)
  // const handleSetButtonImage = (button) => {
  //   setButtonImage(button)
  // }

  return (
    <>
      {sortedComponents.map((data, index) => {
        return (
          <>
            <>
              {data.type === 'paragraph' && (
                <>
                  <OrderInput
                    data={data}
                    index={index}
                    handleOrderChange={handleOrderChange}
                  />

                  <ParagraphInputs
                    data={data}
                    index={index}
                    breakdownIndex={props.breakdownIndex}
                    handleChangeParagraph={(e) => {
                      props.handleChangeParagraph(...e)
                    }}
                  />
                </>
              )}
            </>
            {data.type === 'checkbox' && (
              <React.Fragment>
                <OrderInput
                  data={data}
                  index={index}
                  handleOrderChange={handleOrderChange}
                />
                <Checkboxes
                  checkbox={data}
                  key={index}
                  index={index}
                  breakdownIndex={props.breakdownIndex}
                  handleChange={(e) => handleEditCheckboxes(e, index)}
                />
              </React.Fragment>
            )}
            {data.type === 'textEditor' && (
              <React.Fragment key={index}>
                <OrderInput
                  data={data}
                  index={index}
                  handleOrderChange={handleOrderChange}
                />
                <TextEditorInputs
                  data={data}
                  index={index}
                  breakdownIndex={props.breakdownIndex}
                  handleChangeTextEditor={(e) => {
                    props.handleChangeTextEditor(...e)
                  }}
                />
              </React.Fragment>
            )}
            {data.type === 'button' && (
              <React.Fragment key={index}>
                <OrderInput
                  data={data}
                  index={index}
                  handleOrderChange={handleOrderChange}
                />
                <div>Title</div>
                <input
                  type="text"
                  key="title"
                  className="w-100 p-2"
                  name="title"
                  value={data?.title}
                  onChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeButtons(
                      'title',
                      e.target.value,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <div>Popup Content</div>
                <KendoTextEditor
                  key="content"
                  value={data?.popupContent}
                  minHeight={200}
                  handleChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeButtons(
                      'popupContent',
                      e,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <div>Position</div>
                <PositionSelector
                  selectedPosition={data?.position}
                  handleChangeSelectedPosition={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangePopupButtons(
                      'position',
                      e,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />
              </React.Fragment>
            )}
            {data.type === 'popupButton' && (
              <React.Fragment key={index}>
                <OrderInput
                  data={data}
                  index={index}
                  handleOrderChange={handleOrderChange}
                />
                <PopupButtonInputs
                  data={data}
                  index={index}
                  breakdownIndex={props.breakdownIndex}
                  uuid={data?.uuid}
                  handleChangePopupButtons={(e) => {
                    props.handleChangePopupButtons(...e)
                  }}
                />
              </React.Fragment>
            )}
            {data.type === 'image' && (
              <React.Fragment key={index}>
                <div className={'d-flex justify-content-end'}>
                  <div className="input-group mb-3" style={{ width: 150 }}>
                    <span className="input-group-text">Order:</span>
                    <input
                      type="number"
                      className="form-control"
                      value={data.order}
                      onChange={(e) =>
                        handleOrderChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className={'d-flex justify-content-start'}>
                  <div className="input-group mb-3" style={{ width: 200 }}>
                    <span className="input-group-text">Grid column:</span>
                    <input
                      type="number"
                      className="form-control"
                      value={data.gridColumns}
                      onChange={(e) => {
                        const uuid = data?.uuid
                        return props.handleChangeImages(
                          'gridColumns',
                          e.target.value,
                          index,
                          props.breakdownIndex,
                          uuid
                        )
                      }}
                    />
                  </div>
                </div>
                {data.images?.map((image, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div>Image</div>
                      <KendoTextEditor
                        key="image"
                        value={image?.image}
                        minHeight={200}
                        handleChange={(e) => {
                          const uuid = image?.uuid
                          return props.handleChangeImages(
                            'image',
                            e,
                            index,
                            props.breakdownIndex,
                            uuid
                          )
                        }}
                      />

                      <div>Image Content</div>
                      <KendoTextEditor
                        key="content"
                        value={image?.description}
                        minHeight={200}
                        handleChange={(e) => {
                          const uuid = image?.uuid
                          return props.handleChangeImages(
                            'description',
                            e,
                            index,
                            props.breakdownIndex,
                            uuid
                          )
                        }}
                      />
                      <div>Button</div>
                      {Object.keys(image?.button)?.length > 0 && (
                        <>
                          {/*<PopupButtonInputs*/}
                          {/*  data={image?.button}*/}
                          {/*  index={index}*/}
                          {/*  breakdownIndex={props.breakdownIndex}*/}
                          {/*  uuid={data?.uuid}*/}
                          {/*  handleChangePopupButtons={(e) => {*/}
                          {/*    const event = [...e, 'button']*/}
                          {/*    console.log(...event)*/}
                          {/*    props.handleChangeImages(...event)*/}
                          {/*  }}*/}
                          {/*/>*/}
                          <div>Title</div>
                          <input
                            type="text"
                            key="title"
                            className="w-100 p-2"
                            name="title"
                            value={image?.button?.title}
                            onChange={(e) => {
                              const uuid = image?.uuid
                              return props.handleChangeImages(
                                'title',
                                e.target.value,
                                index,
                                props.breakdownIndex,
                                uuid,
                                'button'
                              )
                            }}
                          />
                          <div>Popup Content</div>
                          <KendoTextEditor
                            key="content"
                            value={image?.button?.popupContent}
                            minHeight={200}
                            handleChange={(e) => {
                              const uuid = image?.uuid
                              return props.handleChangeImages(
                                'popupContent',
                                e,
                                index,
                                props.breakdownIndex,
                                uuid,
                                'button'
                              )
                            }}
                          />

                          <PositionSelector
                            selectedPosition={image?.button?.position}
                            handleChangeSelectedPosition={(e) => {
                              const uuid = image?.uuid

                              return props.handleChangeImages(
                                'position',
                                e,
                                index,
                                props.breakdownIndex,
                                uuid,
                                'button'
                              )
                            }}
                          />
                        </>
                      )}
                      {Object.keys(image?.button)?.length === 0 && (
                        <div
                          className={
                            'd-flex justify-content-center align-items-center '
                          }
                          onClick={() => {
                            const uuid = image?.uuid
                            props.handleAddButtonImage(uuid)
                          }}
                        >
                          <div
                            class={
                              'btn btn-secondary d-flex align-items-center'
                            }
                          >
                            Add a button
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            )}
          </>
        )
      })}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 6,
          padding: 10
        }}
      >
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddParagraph()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center '}>
            Add a paragraph
          </div>
        </div>
        {/*<div*/}
        {/*  className={'d-flex justify-content-center align-items-center '}*/}
        {/*  onClick={() => {*/}
        {/*    props.handleAddTextEditor()*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <div class={'btn btn-secondary d-flex align-items-center'}>*/}
        {/*    Add a text editor*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div*/}
        {/*  className={'d-flex justify-content-center align-items-center '}*/}
        {/*  onClick={() => {*/}
        {/*    props.handleAddCheckbox()*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <div class={'btn btn-secondary d-flex align-items-center'}>*/}
        {/*    Add a checkbox*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div*/}
        {/*  className={'d-flex justify-content-center align-items-center '}*/}
        {/*  onClick={() => {*/}
        {/*    props.handleAddButton()*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <div class={'btn btn-secondary d-flex align-items-center'}>*/}
        {/*    Add a button*/}
        {/*  </div>*/}
        {/*</div>{' '}*/}
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddPopupButton()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center'}>
            Add popup button
          </div>
        </div>
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddImage()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center'}>
            Add image component
          </div>
        </div>
      </div>
    </>
  )
}
export default CustomContent
