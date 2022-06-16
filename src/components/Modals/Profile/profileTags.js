import React, { useState } from 'react'
import { Modal, InputGroup, FormControl } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../../utils/IntlMessages'
import ProfileTag from '../../Tags'

const ProfileTags = (props) => {
  const [userTags, setUsersTags] = useState(props.userTags || [])
  const [searchedTags, setSearchedTags] = useState(props.allTags || [])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [deletedTags, setDeletedTags] = useState([])

  const handleSearch = (event) => {
    const { value } = event.target

    setSearchKeyword(value)
  }
  const removeTag = (tag) => {
    setUsersTags(userTags?.filter((data) => data.id !== tag.id))
    let tags = [...searchedTags]
    tags.push(tag)
    deletedTags.push({ id: tag.id })
    setSearchedTags(tags)
    setDeletedTags(deletedTags)
  }
  const AddTag = (tag) => {
    const data = [...userTags, tag]

    setSearchedTags(searchedTags.filter((item) => item.id !== tag.id))
    setDeletedTags(deletedTags.filter((item) => item !== tag.id))
    setUsersTags(data)
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      className='edit-my-profile-tags'
      keyboard={false}
    >
      <Modal.Header className='edit-modal p-0 mx-4 '>
        <h3 className='mt-4 mb-0'>
          <IntlMessages id='my_account.edit_my_profile_tags' />
        </h3>
        <button
          type='button'
          className='btn-close me-0 me-md-1 ms-2 ms-md-0'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className='mx-4 mt-2 p-0'>
        <FormattedMessage
          id='my_account.edit_my_profile_tags_select'
          default='my_account.edit_my_profile_tags_select'
        >
          {(text) => (
            <p className='mt-3' style={{ fontSize: '24px', fontWeight: 600 }}>
              {text}
            </p>
          )}
        </FormattedMessage>
        <FormattedMessage
          id='my_account.edit_my_profile_tags_select_up'
          default='my_account.edit_my_profile_tags_select_up'
        >
          {(text) => (
            <p
              style={{
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '300',
                color: '#333D3D83'
              }}
            >
              {text}
            </p>
          )}
        </FormattedMessage>
        <InputGroup className='edit-my-profile-tags-input mb-4'>
          <InputGroup.Text
            style={{ backgroundColor: '#FFFF', borderColor: '#bbbdbf' }}
            className='mx-auto rounded-0'
          >
            <FontAwesomeIcon icon={faSearch} style={{ color: '#707070' }} />
          </InputGroup.Text>
          <FormattedMessage id='my_account.edit_my_profile_tags_search_box'>
            {(placeholder) => (
              <FormControl
                id='inlineFormInputGroupUsername'
                onChange={handleSearch}
                placeholder={placeholder}
                name='search'
                style={{
                  outline: 'none',
                  textAlign: 'left',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: '#707070',
                  borderColor: '#bbbdbf'
                }}
                className='edit-profile-tags-search-box shadow-none border-start-0 py-2 ps-0 rounded-0'
              />
            )}
          </FormattedMessage>
        </InputGroup>
        {searchKeyword?.length > 0 ? (
          <div className='mt-0 mb-5'>
            {searchKeyword?.length > 0
              ? searchedTags
                  ?.filter((item) =>
                    item.name
                      .toLowerCase()
                      .includes(searchKeyword.toLowerCase())
                  )
                  ?.map(
                    (tag, index) =>
                      index < 4 && (
                        <ProfileTag
                          key={index}
                          tags={tag.name}
                          id={tag.id}
                          onClick={() => AddTag(tag)}
                        />
                      )
                  )
              : ''}
          </div>
        ) : (
          ''
        )}
        <FormattedMessage id='my_account.edit_my_profile_select_tags'>
          {(text) => <p className='edit-selected-tags mt-2 mb-0'>{text}</p>}
        </FormattedMessage>
        {userTags?.length != 0 && (
          <div className='w-100'>
            {userTags?.map((tag, index) => (
              <ProfileTag
                key={index}
                tags={tag.name}
                id={tag.id}
                icon={'X'}
                onClick={() => removeTag(tag)}
              />
            ))}
          </div>
        )}
      </Modal.Body>
      <div className='border-0 mb-2 mx-4'>
        <div className='row p-0 mb-3'>
          <div className='col-md-12'>
            <button
              className='float-end edit-account mt-4'
              disabled={props.loading}
              onClick={() =>
                props.saveUserTags(
                  userTags.length > 0 ? userTags : [{ name: searchKeyword }],
                  deletedTags
                )
              }
            >
              {props.loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.save' />
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileTags
