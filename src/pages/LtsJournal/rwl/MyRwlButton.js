import React, { useEffect, useState } from 'react'
import AccordionItemWrapper from '../AccordionItemWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faList, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import {
  removeUserSelection,
  userSelectionIsCheckedToggle
} from '../../../redux/rwl/actions'
import ArticleModal from './modals/articleModal'
import { faFileAlt } from '@fortawesome/free-regular-svg-icons'

const RwlListContainer = ({
  title,
  color,
  items,
  userSelections,
  isEditable
}) => {
  const [articleModal, setArticleModal] = useState({
    state: false,
    id: null,
    name: ''
  })
  const dispatch = useDispatch()

  const isCheckedToggle = (itemID) => {
    dispatch(userSelectionIsCheckedToggle(itemID))
  }

  const userSelectionRemove = (itemID) => {
    dispatch(removeUserSelection(itemID))
  }

  return (
    <>
      <div className="myrwl-inside-container">
        <h6 style={{ color: color }}>{title}</h6>
        <div className="ps-3">
          {items.map((item, index) => (
            <div className="d-flex justify-content-between pb-2" key={index}>
              <span>{item.name}</span>

              <div className="icons-container">
                {isEditable && (
                  <i
                    className="cursor-pointer"
                    onClick={() => userSelectionRemove(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </i>
                )}

                <i
                  className={isEditable ? 'cursor-pointer' : ''}
                  onClick={
                    isEditable ? () => isCheckedToggle(item.id) : undefined
                  }
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={
                      userSelections.some(
                        (selection) =>
                          selection.itemID === item.id && selection.isChecked
                      )
                        ? 'isChecked'
                        : ''
                    }
                  />
                </i>
                <i
                  className={'cursor-pointer'}
                  onClick={() =>
                    setArticleModal({
                      state: true,
                      id: item.id,
                      name: item.name
                    })
                  }
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                </i>
              </div>
              {articleModal && (
                <ArticleModal
                  show={articleModal.state}
                  onHide={() => setArticleModal(false)}
                  backdrop="static"
                  keyboard={false}
                  category={title}
                  title={articleModal.name}
                  color={color}
                  id={articleModal.id}
                  isEditable={isEditable}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const MyRwlButton = (props) => {
  const [openAccordion, setOpenAccordion] = useState(null)

  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  return (
    <AccordionItemWrapper
      isOpened={openAccordion === `myrwl`}
      handleAccordionClick={() => handleAccordionClick(`myrwl`)}
      isExanded={false}
      title={'MY RWL'}
    >
      {openAccordion === 'myrwl' && (
        <div className="accordion-content">
          <RwlListContainer
            title="read"
            color="#F2359D"
            items={props.readSelectedItems}
            userSelections={props.userSelections}
            isEditable={props.isEditable}
          />
          <RwlListContainer
            title="watch"
            color="#A7CA42"
            items={props.watchSelectedItems}
            userSelections={props.userSelections}
            isEditable={props.isEditable}
          />
          <RwlListContainer
            title="listen"
            color="#51C7DF"
            items={props.listenSelectedItems}
            userSelections={props.userSelections}
            isEditable={props.isEditable}
          />
        </div>
      )}
    </AccordionItemWrapper>
  )
}

export default MyRwlButton
