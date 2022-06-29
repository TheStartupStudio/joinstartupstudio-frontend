import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import EditFounderComponent from '../EditFounderComponent'
import axiosInstance from '../../../../utils/AxiosInstance'
import AsyncSelect from 'react-select/async'
import { useParams } from 'react-router-dom'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { components } from 'react-select'
import SingleFounder from '../singleFounder'
import IntlMessages from '../../../../utils/IntlMessages'

const EditFounderModal = (props) => {
  const id = useParams().id
  const [selectedUser, setSelectedUser] = useState([])

  const getFilteredUsers = _.debounce((keyword, callback) => {
    if (keyword.length < 3) return callback(null)
    axiosInstance
      .get(`/users/filter-users/${keyword}`)
      .then((res) => {
        const options = res.data.users.map((user, index) => {
          return {
            label: user.name,
            value: user,
            key: index
          }
        })
        callback(options)
      })
      .catch((e) => callback(null))
  }, 500)

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{
                color: '#333d3d',
                height: '37px',
                width: '36px',
                position: 'absolute',
                marginLeft: '10px',
                left: '6'
                // cursor: 'pointer'
              }}
              onClick={props.closeChat}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className=''
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4 general-modal-header'>
        <h3 className='mb-0 pt-4 mt-2'>EDIT FOUNDERS</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => props.onHide()}
        />
      </Modal.Header>
      <Modal.Body className='pb-5 px-4 px-md-5'>
        {props.founder.map((data, index) => {
          return (
            <EditFounderComponent
              data={data}
              key={index}
              removeFounder={(id) => props.removeFounder(id)}
              updateState={(e, uid) => props.updateState(e, uid)}
            />
          )
        })}
        <>
          <AsyncSelect
            className='mt-5'
            value={{
              label: 'SEARCH YOUR COMMUNITY TO ADD A NEW FOUNDER’S PROFILE'
            }}
            loadOptions={getFilteredUsers}
            onChange={(e) => props.handleUserSelect(e)}
            // theme={(theme) => ({
            //   ...theme,
            //   borderRadius: 0,
            //   outLine: 'none',
            //   colors: {
            //     ...theme.colors,
            //     // primary25: 'hotpink',
            //     primary: '#e4e44',
            //     neutral0: '#e4e4e4',
            //     opacity: 1,
            //     zIndex: 100
            //   },
            //   spacing: {
            //     ...theme.spacing,
            //     controlHeight: 32
            //   },
            //   zIndex: 100
            // })}
            // styles={{
            //   control: (provided, state) => ({
            //     ...provided,
            //     boxShadow: 'none',
            //     border: 'none',
            //     height: 15,
            //     fontSize: '14px',
            //     height: '50px'
            //   }),
            //   menu: (base) => ({
            //     ...base,
            //     border: 'none',
            //     boxShadow: 'none',
            //     fontSize: '14px'
            //   }),
            //   valueContainer: (base) => ({
            //     ...base,
            //     paddingLeft: 50
            //   })
            // }}

            components={{
              ValueContainer,
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              outLine: 'none',
              spacing: {
                ...theme.spacing,
                controlHeight: 32
              },
              colors: {
                ...theme.colors,
                neutral50: '#707070' // Placeholder color
              }
            })}
            styles={{
              valueContainer: (base) => ({
                ...base,
                paddingLeft: 60
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#707070',
                fontWeight: '500'
              }),
              control: (provided, state) => ({
                ...provided,
                boxShadow: 'none',
                border: 'none',
                height: 15,
                fontSize: '14px',
                height: '50px',
                border: '1px solid #BBBDBF',
                color: '#707070'
              }),
              menu: (base) => ({
                ...base,
                border: 'none',
                boxShadow: 'none',
                fontSize: '14px',
                border: '1px solid #BBBDBF',
                color: '#707070'
              })
            }}
            classNamePrefix='vyrill'
          />
          {selectedUser &&
            selectedUser?.map((data, index) => {
              return (
                <SingleFounder
                  data={data}
                  key={index}
                  from={'edit'}
                  removeFounder={(id) => {
                    props.removeFounder(id)
                  }}
                  // updateRole={(e, uid) => updateRole(e, uid)}
                />
              )
            })}
        </>
      </Modal.Body>
      <Modal.Footer className='border-0 px-5 position-relative edit_founder-footer'>
        <div className='row p-0 mb-3'>
          <button
            className='float-end edit-account'
            disabled={props.loading}
            onClick={() => {
              props.save()
            }}
          >
            {props.loading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              <IntlMessages id='general.save' />
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditFounderModal
