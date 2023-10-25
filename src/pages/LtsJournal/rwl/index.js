import React, { useEffect, useState } from 'react'
import MyRwlButton from './MyRwlButton'
import RwlButtons from './RwlButtons'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllItems,
  fetchAllUserSelections
} from '../../../redux/rwl/actions'

const Rwl = () => {
  const dispatch = useDispatch()
  const [readSelectedItems, setReadSelectedItems] = useState([])
  const [watchSelectedItems, setWatchSelectedItems] = useState([])
  const [listenSelectedItems, setListenSelectedItems] = useState([])
  const { userSelections, items, loading, error } = useSelector(
    (state) => state.rwlJournal
  )

  useEffect(() => {
    const newReadItems = []
    const newWatchItems = []
    const newListenItems = []

    userSelections?.forEach((item) => {
      const rwlItem = items.find((rwl) => rwl.id === item.itemID)

      if (rwlItem) {
        if (rwlItem.categoryID === 1) {
          newReadItems.push(rwlItem)
        } else if (rwlItem.categoryID === 2) {
          newWatchItems.push(rwlItem)
        } else if (rwlItem.categoryID === 3) {
          newListenItems.push(rwlItem)
        }
      }
    })

    // Update state with the filtered selections
    setReadSelectedItems(newReadItems)
    setWatchSelectedItems(newWatchItems)
    setListenSelectedItems(newListenItems)
  }, [userSelections, items])

  useEffect(() => {
    dispatch(fetchAllUserSelections())
    dispatch(fetchAllItems())
  }, [dispatch])

  return (
    <div className="rwl">
      <MyRwlButton
        userSelections={userSelections}
        items={items}
        readSelectedItems={readSelectedItems}
        watchSelectedItems={watchSelectedItems}
        listenSelectedItems={listenSelectedItems}
      />
      <ul className="page-card__content-description">
        <p className="fw-bold">Suggestions for creating RWL habits:</p>
        <li>
          Choose one resource that you are checking in with daily. This resource
          should be one that is updated daily and your goal is to consume one
          story from this resource every day. This can be one news article, or
          one video, or one podcast episode a day. It’s easier to commit to
          habits when you tie them to part of your already established routine.
          So, if you are the passenger of a car, bus, or train to get to school
          or work everyday, you can RWL during that time.
        </li>
        <li>
          Choose a resource that has more in-depth content than your daily
          resource and check in with this one once a week. This can be a
          magazine which tends to have longer articles than newspapers. This can
          be a weekly rather than daily podcast which tends to have longer
          episodes. This can be an episode of a series.
        </li>
        <li>
          Choose a resource that you will have to return to regularly to
          completely finish reading, watching or listening and make this a
          monthly habit. For reading, this would be a book. For watching, this
          would be a documentary or documentary series. For listening, this
          would be a podcast show not just an episode.
        </li>
        <p className="pt-3">
          Through the buttons below, you will see the Learn to Start
          recommendations for Read, Watch, and Listen resources. You can save
          the recommendations you want to consume, check off the ones you have
          completed, and write analytical articles for the ones you have
          completed that you can add to your portfolios. Get started now, by
          clicking on Read, Watch, or Listen.
        </p>
      </ul>
      <RwlButtons
        userSelections={userSelections}
        items={items}
        readSelectedItems={readSelectedItems}
        watchSelectedItems={watchSelectedItems}
        listenSelectedItems={listenSelectedItems}
      />
    </div>
  )
}

export default Rwl
