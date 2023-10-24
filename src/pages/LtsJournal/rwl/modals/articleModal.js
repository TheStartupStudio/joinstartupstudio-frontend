import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  createUserArticle,
  getUserArticle,
  updateUserArticle
} from '../../../../redux/rwl/actions'
import { toast } from 'react-toastify'

const ArticleModal = (props) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { userArticles } = useSelector((state) => state.rwlJournal)
  const [article, setArticle] = useState(null)
  const [isEditable, setIsEditable] = useState(false)

  const handleArticleForm = (event) => {
    const { name, value } = event.target
    if (name === 'article') {
      setArticle(value)
    }
  }

  useEffect(() => {
    if (props?.id) {
      dispatch(getUserArticle(props?.id)).then((res) => {
        if (res.status === 200) {
          setIsEditable(true)
          setArticle(res.data.content)
        }
      })
    }
  }, [dispatch, props?.id])

  const submitArticle = async (itemID, content) => {
    setLoading(true)
    try {
      if (!isEditable) {
        dispatch(createUserArticle(itemID, content))
        toast.success('Article created successfuly!')
      } else {
        dispatch(updateUserArticle(userArticles.id, content))
        toast.success('Article updated successfuly!')
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
      setTimeout(() => {
        props.onHide()
      }, 500)
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id="contact-us-modal"
    >
      <Modal.Header className="contact-us-title my-auto p-0 mx-4">
        <h3 className="pt-4 mt-2" style={{ color: props?.color }}>
          {props?.category}
        </h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props?.onHide}
        />
      </Modal.Header>
      <Modal.Body className="my-auto py-3 ">
        <h4>{props?.title}</h4>
        <div className="contact-us">
          <FormattedMessage
            id="modal.contact_us_message"
            defaultMessage="modal.contact_us_message"
          >
            {(placeholder) => (
              <textarea
                className="mb-3"
                name="article"
                placeholder={'Write your analysis:'}
                value={article}
                onChange={handleArticleForm}
              />
            )}
          </FormattedMessage>

          <button onClick={() => submitArticle(props?.id, article)}>
            {loading ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ArticleModal
