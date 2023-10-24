import React from 'react'
import './style.css'
import ReadImage from '../../../assets/images/read_watch_listen_Read_with typo.png'
import ReadImageWIthBackground from '../../../assets/images/Read-01.jpg'
import WatchImage from '../../../assets/images/read_watch_listen_Watch_with typo.png'
import WatchImageWIthBackground from '../../../assets/images/Watch.jpg'
import ListenImage from '../../../assets/images/read_watch_listen_Listen_with typo.png'
import ListenImageWIthBackground from '../../../assets/images/Listen.jpg'
import { useState } from 'react'
import RwlButton from './RwlButton'
import { Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import {
  addUserSelection,
  removeUserSelection
} from '../../../redux/rwl/actions'
import RecommendationModal from './modals/recommendationModal'

const RwlButtons = (props) => {
  const dispatch = useDispatch()
  const [recommendationModal, setRecommendationModal] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)

  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  const createUserSelection = (itemID, category) => {
    const categoryID = category
    const item = props.items.find((item) => item.id === +itemID)
    const unCheckedSelectionsForCategory = props.userSelections.filter(
      (userSel) => {
        const selectedItem = props.items.find(
          (item) => item.id === userSel.itemID
        )
        return selectedItem.categoryID === categoryID && !userSel.isChecked
      }
    )

    const isItemInSelections = props.userSelections?.find(
      (item) => item.itemID === +itemID
    )

    if (unCheckedSelectionsForCategory.length < 2) {
      if (isItemInSelections) {
        dispatch(removeUserSelection(itemID))
      } else {
        dispatch(addUserSelection(itemID))
      }
    } else {
      setRecommendationModal(true)
    }
  }

  return (
    <div
      className={` rwl-buttons_container ${props.isOpened ? 'expanded' : ''}`}
    >
      <RwlButton
        isOpened={openAccordion === 'read'}
        handleAccordionClick={() => handleAccordionClick('read')}
        isExanded={true}
        title={
          <button
            className={`rwl-buttons  ${
              openAccordion === 'read' ? 'active' : ' '
            }`}
          >
            <img
              src={
                openAccordion === 'read' ? ReadImageWIthBackground : ReadImage
              }
              alt="Read"
            />
          </button>
        }
      >
        {openAccordion === 'read' && (
          <div className="rwl-button_body">
            <Form>
              {props.items
                ?.filter((item) => item.categoryID === 1)
                .map((item, index) => (
                  <Form.Check
                    key={`default-${index}`}
                    type="checkbox"
                    name={`${item.name}`}
                    id={item.id}
                    label={item.name}
                    checked={props.userSelections.some(
                      (userSel) => userSel.itemID === item.id
                    )}
                    onClick={(e) => createUserSelection(e.target.id, 1)}
                    disabled={
                      props.userSelections.filter(
                        (userSel) =>
                          userSel.categoryID === 1 && !userSel.isChecked
                      ).length >= 2
                    }
                  />
                ))}
            </Form>
          </div>
        )}
      </RwlButton>
      <RwlButton
        isOpened={openAccordion === 'watch'}
        handleAccordionClick={() => handleAccordionClick('watch')}
        isExanded={true}
        title={
          <button
            className={`rwl-buttons  ${
              openAccordion === 'watch' ? 'active' : ' '
            }`}
          >
            <img
              src={
                openAccordion === 'watch'
                  ? WatchImageWIthBackground
                  : WatchImage
              }
              alt="Watch"
            />
          </button>
        }
      >
        {openAccordion === 'watch' && (
          <div className="rwl-button_body">
            <Form>
              {props.items
                ?.filter((item) => item.categoryID === 2)
                .map((item, index) => (
                  <Form.Check
                    key={`default-${index}`}
                    type="checkbox"
                    id={item.id}
                    label={item.name}
                    checked={props.userSelections.some(
                      (userSel) => userSel.itemID === item.id
                    )}
                    onClick={(e) => createUserSelection(e.target.id, 2)}
                    disabled={
                      props.userSelections.filter(
                        (userSel) =>
                          userSel.categoryID === 2 && !userSel.isChecked
                      ).length >= 2
                    }
                  />
                ))}
            </Form>
          </div>
        )}
      </RwlButton>
      <RwlButton
        isOpened={openAccordion === 'listen'}
        handleAccordionClick={() => handleAccordionClick('listen')}
        isExanded={true}
        title={
          <button
            className={`rwl-buttons  ${
              openAccordion === 'listen' ? 'active' : ' '
            }`}
          >
            <img
              src={
                openAccordion === 'listen'
                  ? ListenImageWIthBackground
                  : ListenImage
              }
              alt="Listen"
            />
          </button>
        }
      >
        {openAccordion === 'listen' && (
          <div className="rwl-button_body">
            <Form>
              {props.items
                ?.filter((item) => item.categoryID === 3)
                .map((item, index) => (
                  <Form.Check
                    key={`default-${index}`}
                    type="checkbox"
                    id={item.id}
                    label={item.name}
                    checked={props.userSelections.some(
                      (userSel) => userSel.itemID === item.id
                    )}
                    onClick={(e) => createUserSelection(e.target.id, 3)}
                    disabled={
                      props.userSelections.filter(
                        (userSel) =>
                          userSel.categoryID === 3 && !userSel.isChecked
                      ).length >= 2
                    }
                  />
                ))}
            </Form>
          </div>
        )}
      </RwlButton>

      {recommendationModal && (
        <RecommendationModal
          show={recommendationModal}
          onHide={() => setRecommendationModal(false)}
        />
      )}
    </div>
  )
}

export default RwlButtons
