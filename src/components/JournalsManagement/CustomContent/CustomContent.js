import React, { useEffect, useState } from 'react'
import PositionSelector from '../../PositionSelector/PositionSelector'
import ParagraphInputs from './ParagraphInputs'
import OrderInput from './OrderInput'
import PopupButtonInputs from './PopupButtonInputs'
import { QuillEditorBox } from '../../../ui/ContentItems'

const CustomContent = (props) => {
  const [sortedComponents, setSortedComponents] = useState([])

  useEffect(() => {
    if (props.breakdown?.customContent) {
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
    props.breakdown?.customContent?.buttons?.length,
    props.breakdown?.customContent?.popupButtons?.length,
    props.breakdown?.customContent?.images?.length,
    props.breakdown?.customContent?.imageGallery?.images?.length,
    props.breakdown?.customContent?.paragraphs,
    props.breakdown?.customContent?.buttons,
    props.breakdown?.customContent?.popupButtons,
    props.breakdown?.customContent?.images,
    props.breakdown?.customContent?.imageGallery?.images,
    props.breakdown?.customContent?.imageGallery?.position,
    props.breakdown?.customContent?.imageGallery?.borderBottom,
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

            {data.type === 'button' && (
              <React.Fragment key={index}>
                <OrderInput
                  data={data}
                  index={index}
                  handleOrderChange={handleOrderChange}
                />
                <div>Title</div>
                <input
                  type='text'
                  key='title'
                  className='w-100 p-2'
                  name='title'
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

                <QuillEditorBox
                  title='Popup Content'
                  key='content'
                  value={data?.popupContent}
                  minHeight={200}
                  onChange={(e) => {
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
                  <div className='input-group mb-3' style={{ width: 150 }}>
                    <span className='input-group-text'>Order:</span>
                    <input
                      type='number'
                      className='form-control'
                      value={data.order}
                      onChange={(e) =>
                        handleOrderChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className={'d-flex justify-content-start'}>
                  <div className='input-group mb-3' style={{ width: 200 }}>
                    <span className='input-group-text'>Grid column:</span>
                    <input
                      type='number'
                      className='form-control'
                      value={data.gridColumns}
                      onChange={(e) => {
                        const uuid = data?.uuid
                        return props.handleChangeImageGallery(
                          'gridColumns',
                          e.target.value,
                          props.breakdownIndex,
                          uuid
                        )
                      }}
                    />
                  </div>
                  <label className='px-0 ps-sm-1 ps-lg-1 form-switch my-auto d-flex'>
                    <input
                      type='checkbox'
                      checked={data.borderBottom}
                      onChange={(e) => {
                        const uuid = data?.uuid
                        return props.handleChangeImageGallery(
                          'borderBottom',
                          e.target.checked,
                          props.breakdownIndex,
                          uuid
                        )
                      }}
                    />
                    Has bottom border?
                    <i className='ms-auto'></i>
                  </label>
                </div>
                {data.images?.map((image, index) => {
                  return (
                    <React.Fragment key={index}>
                      <QuillEditorBox
                        title='Image'
                        key='image'
                        value={data?.popupContent}
                        minHeight={200}
                        onChange={(e) => {
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

                      <QuillEditorBox
                        title='Image Content'
                        key='content'
                        value={data?.description}
                        minHeight={200}
                        onChange={(e) => {
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
                            type='text'
                            key='title'
                            className='w-100 p-2'
                            name='title'
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

                          <QuillEditorBox
                            title='Popup Content'
                            key='content'
                            value={image?.button?.popupContent}
                            minHeight={200}
                            onChange={(e) => {
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
