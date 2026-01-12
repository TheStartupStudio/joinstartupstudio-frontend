// import {
//   faCheck,
//   faIdBadge,
//   faUserLock,
//   faUserMinus,
//   faUserPlus
// } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import React, { useState } from 'react'
// import { Col, Modal, Row } from 'react-bootstrap'
// import {
//   CustomDropdown,
//   CustomInput,
//   SkillBox,
//   SubmitButton
// } from '../ContentItems'
// import LtsCheckbox from '../../../../ui/LtsCheckbox'
// import { useValidation } from '../../../../hooks/useValidation'
// import { useForm } from '../../../../hooks/useForm'
// import useIsFormEmpty from '../../../../hooks/useIsFormEmpty'
// import { Auth } from 'aws-amplify'
// import axiosInstance from '../../../../utils/AxiosInstance'
// import { toast } from 'react-toastify'
// import Certification1Badge from '../../../../assets/images/market-ready-1-badge.png'
// import Certification2Badge from '../../../../assets/images/market-ready-2-badge.png'

// const StudentActionsModal = ({
//   show,
//   onHide,
//   mode,
//   user,
//   programs = [],
//   universities = [],
//   levels = [],
//   instructors = [],
//   periods = [],
//   onSuccess,
//   resetPasswordFromEdit = () => {},
//   deleteUserFromEdit = () => {},
//   transferHandler = () => {}
// }) => {
//   const [openDropdown, setOpenDropdown] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [formSubmitted, setFormSubmitted] = useState(false)

//   const initialState = {
//     universityId: '',
//     email: '',
//     name: '',
//     password: '',
//     levels: [],
//     programs: [],
//     instructor_id: '',
//     period: '',
//     profession: 'student',
//     deactivated: false
//   }

//   const {
//     formData,
//     handleChange,
//     handleChangeCheckbox,
//     handleChangeDropdown,
//     handleChangeSelect
//   } = useForm(initialState, user, mode, loading)

//   let optionalFields = ['deactivated', 'period']

//   const validatePayload =
//     mode === 'edit'
//       ? {
//           universityId: formData.universityId,
//           name: formData.name,
//           email: formData.email,
//           profession: formData.profession,
//           programs: formData.programs,
//           levels: formData.levels
//         }
//       : formData

//   const { errors, handleSubmit, submitLoading } = useValidation(
//     validatePayload,
//     setFormSubmitted,
//     optionalFields
//   )
//   console.log('errors', errors)

//   const handleDropdownClick = (dropdownName) => {
//     setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
//   }

//   const submitHandler = () => {
//     handleSubmit(async () => {
//       if (mode === 'edit') {
//         let payload = {
//           universityId: formData.universityId,
//           universityName: formData.universityName,
//           name: formData.name,
//           email: formData.email,
//           profession: formData.profession,
//           programs: formData.programs.map((item) => item.name),
//           levels: formData.levels.map((item) => item.name),
//           deactivated: formData.deactivated
//         }
//         let res = await axiosInstance.patch(
//           `/instructor/update-student/${formData.id}`,
//           payload
//         )

//         if (res) {
//           toast.success('Student updated successfully!')
//           onSuccess()
//           onHide()
//         } else {
//           toast.error('Something went wrong!')
//         }
//       } else {
//         await Auth.signUp({
//           username: formData.email,
//           password: formData.password,
//           attributes: {
//             'custom:universityCode': 'dev2020',
//             'custom:isVerified': '1',
//             'custom:language': 'en',
//             'custom:email': formData.email,
//             'custom:password': formData.password,
//             name: formData.name
//           }
//         })
//           .then(async (res) => {
//             let payload = {
//               ...formData,
//               name: formData.name,
//               cognito_Id: res.userSub,
//               stripe_subscription_id: 'true',
//               payment_type: 'school',
//               is_active: 1
//             }
//             await axiosInstance
//               .post('/instructor/add-users', payload)
//               .then(() => {
//                 setLoading(false)
//                 toast.success('Student added successfully!')
//                 onSuccess()
//                 onHide()
//               })
//               .catch((err) => {
//                 console.log('err', err)
//               })
//           })
//           .catch((err) => {
//             console.log('err', err)
//           })
//       }
//     })
//   }

//   const isFormEmpty = useIsFormEmpty(formData)
//   const isFormEdited = JSON.stringify(formData) === JSON.stringify(user)
//   const isDisabled = mode === 'edit' ? isFormEdited : isFormEmpty

//   return (
//     <>
//       <Modal
//         show={show}
//         className={''}
//         onHide={() => {
//           onHide()
//         }}
//         centered
//         // style={{ marginTop: '3.9%' }}
//         // dialogClassName='custom-modal-lg'
//       >
//         <Modal.Header className='position-relative p-3'>
//           <Modal.Title
//             className='px-3 py-3 w-100 d-flex fw-normal flex-column'
//             style={{ fontSize: '16px' }}
//           >
//             <div
//               className='d-flex align-items-center justify-content-center mb-3'
//               style={{
//                 width: '36px',
//                 height: '36px',
//                 background: '#C8CDD880',
//                 fontSize: '15px',
//                 borderRadius: '50%'
//               }}
//             >
//               <FontAwesomeIcon icon={faUserPlus} />
//             </div>
//             <div className='d-flex w-100 align-items-center justify-content-between'>
//               <span>
//                 {mode === 'add' ? 'Add New Student' : 'Edit Instructor Details'}
//               </span>
//               <span className='d-flex align-items-center'>
//                 Transfer Status{' '}
//                 <span onClick={transferHandler}>
//                   <SkillBox
//                     withStatus={true}
//                     color={`transfer__none`}
//                     text={'None'}
//                   />
//                 </span>
//               </span>
//             </div>
//           </Modal.Title>
//           {mode !== 'edit' ? (
//             <div className={`check-button fw-bold`} onClick={() => onHide()}>
//               X
//             </div>
//           ) : submitLoading ? (
//             <div className={`check-button fw-bold`}>
//               <span className='spinner-border-info spinner-border-sm' />
//             </div>
//           ) : (
//             <div
//               className={`check-button  ${isDisabled ? 'disabled' : ''}`}
//               onClick={!isDisabled ? submitHandler : null}
//             >
//               <FontAwesomeIcon icon={faCheck} />
//             </div>
//           )}
//         </Modal.Header>
//         <Modal.Body>
//           <Row className='m-0'>
//             <Col md='6'>
//               <p>User details</p>
//               <CustomInput
//                 placeholder={'User Name (required)'}
//                 type={'text'}
//                 name='name'
//                 value={mode === 'edit' ? formData.name : null}
//                 handleChange={handleChange}
//                 showError={formSubmitted}
//                 error={errors.name}
//               />
//               <CustomInput
//                 placeholder={'User Email (required)'}
//                 type={'text'}
//                 name='email'
//                 value={mode === 'edit' ? formData.email : null}
//                 handleChange={handleChange}
//                 showError={formSubmitted}
//                 error={errors.email}
//               />
//               {mode !== 'edit' && (
//                 <CustomInput
//                   placeholder={'Password (required)'}
//                   type={'password'}
//                   name='password'
//                   value={mode === 'edit' ? formData.password : null}
//                   handleChange={handleChange}
//                   showError={formSubmitted}
//                   error={errors.password}
//                 />
//               )}
//               <div className='py-3'>
//                 <p>Set Status</p>
//                 <span
//                   className='d-flex align-items-center'
//                   style={{ color: '#9297A1' }}
//                 >
//                   Uanctive
//                   <LtsCheckbox
//                     className={'ps-1'}
//                     name='deactivated'
//                     toggle={(e) => handleChangeCheckbox(e, 'my-school')}
//                     checked={
//                       mode === 'edit'
//                         ? !formData.deactivated
//                         : !formData.deactivated
//                     }
//                   />
//                   Active
//                 </span>
//               </div>
//               <div className='py-3'>
//                 <p>Certification Progress</p>
//                 <div
//                   className='d-flex justify-content-evenly text-center w-50'
//                   style={{ fontSize: '14px' }}
//                 >
//                   <div className='w-50 d-flex align-items-center'>
//                     <div className='w-50'>
//                       <img
//                         className='w-75 h-75'
//                         src={Certification1Badge}
//                         alt=''
//                       />
//                     </div>
//                     <span>
//                       <span className='d-flex' style={{ height: '20px' }}>
//                         <p className='text-info mb-0 pb-0 fw-bold'>
//                           {mode === 'edit'
//                             ? formData.completedSkills1?.length
//                             : 0}
//                         </p>
//                         /<p className='mb-0 pb-0'>15</p>
//                       </span>
//                       <small>Skills</small>
//                     </span>
//                   </div>
//                   <div className='w-50 d-flex align-items-center'>
//                     <div className='w-50'>
//                       <img
//                         className='w-75 h-75'
//                         src={Certification2Badge}
//                         alt=''
//                       />
//                     </div>
//                     <span>
//                       <span className='d-flex'>
//                         <p
//                           className='p-0 m-0 fw-bold'
//                           style={{ color: '#a22f6a' }}
//                         >
//                           {mode === 'edit'
//                             ? formData.completedSkills2?.length
//                             : 0}
//                         </p>
//                         /<p className='mb-0 pb-0'>20</p>
//                       </span>
//                       <small>Skills</small>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <a href={`/public-portfolio/${formData.username}`}>
//                 <FontAwesomeIcon icon={faIdBadge} className='me-2' /> View
//                 Student Portfolio
//               </a>
//             </Col>
//             <Col md='6'>
//               <div className='pb-3'>
//                 <p className='m-0'> Select School Assignment</p>
//                 <CustomDropdown
//                   isSelectable
//                   exclusive
//                   name='universityId'
//                   btnClassName={'instructor'}
//                   options={universities?.map((university) => {
//                     return {
//                       name: university.name,
//                       value: university.name,
//                       id: university.id
//                     }
//                   })}
//                   isOpen={openDropdown === 'schoolAssignment'}
//                   setOpenDropdown={() =>
//                     handleDropdownClick('schoolAssignment')
//                   }
//                   onClick={(event) => handleChangeSelect(event, 'universityId')}
//                   showError={formSubmitted}
//                   error={errors.universityId}
//                   preselectedOptions={
//                     mode === 'edit'
//                       ? [
//                           {
//                             name: formData.University?.name,
//                             id: formData.universityId
//                           }
//                         ]
//                       : []
//                   }
//                 />
//               </div>
//               <div className='pb-3'>
//                 <p className='m-0'>Select Level(s)</p>
//                 <CustomDropdown
//                   isSelectable
//                   exclusive
//                   multiple
//                   name='levels'
//                   btnClassName={'instructor'}
//                   options={levels}
//                   onClick={(selectedOptions) =>
//                     handleChangeDropdown(selectedOptions, mode, 'levels')
//                   }
//                   isOpen={openDropdown === 'levels'}
//                   setOpenDropdown={() => handleDropdownClick('levels')}
//                   preselectedOptions={mode === 'edit' ? formData.levels : []}
//                   showError={formSubmitted}
//                   error={errors.levels}
//                 />
//               </div>
//               <div className='pb-3'>
//                 <p className='m-0'>Assign Program(s)</p>
//                 <CustomDropdown
//                   isSelectable
//                   exclusive
//                   multiple
//                   name='programs'
//                   btnClassName={'instructor'}
//                   options={programs?.map((program) => ({
//                     name: program.name,
//                     value: program.name,
//                     id: program.id
//                   }))}
//                   onClick={(selectedOptions) => {
//                     handleChangeDropdown(selectedOptions, mode, 'programs')
//                   }}
//                   isOpen={openDropdown === 'programs'}
//                   setOpenDropdown={() => handleDropdownClick('programs')}
//                   preselectedOptions={mode === 'edit' ? formData.programs : []}
//                   showError={formSubmitted}
//                   error={errors.programs}
//                 />
//               </div>
//               <div className='pb-3'>
//                 <p className='m-0'> Assign Instructor</p>
//                 <CustomDropdown
//                   isSelectable
//                   exclusive
//                   name='instructor_id'
//                   btnClassName={'instructor'}
//                   options={instructors?.map((instructor) => {
//                     return {
//                       name: instructor.User.name,
//                       value: instructor.User.name,
//                       id: instructor.id
//                     }
//                   })}
//                   isOpen={openDropdown === 'instructors'}
//                   setOpenDropdown={() => handleDropdownClick('instructors')}
//                   onClick={(event) =>
//                     handleChangeSelect(event, 'instructor_id')
//                   }
//                   showError={formSubmitted}
//                   error={errors.instructor_id}
//                   preselectedOptions={
//                     mode === 'edit'
//                       ? [
//                           {
//                             name: formData.Instructor?.User?.name,
//                             id: formData.instructor_id
//                           }
//                         ]
//                       : []
//                   }
//                 />
//               </div>
//               <div className='pb-3'>
//                 <p className='m-0'> Select Class Period</p>
//                 <CustomDropdown
//                   isSelectable
//                   exclusive
//                   name='period'
//                   btnClassName={'instructor'}
//                   options={periods?.map((period) => {
//                     return {
//                       name: period.name,
//                       value: period.name,
//                       id: period.id
//                     }
//                   })}
//                   isOpen={openDropdown === 'period'}
//                   setOpenDropdown={() => handleDropdownClick('period')}
//                   onClick={(event) => handleChangeSelect(event, 'period')}
//                   showError={formSubmitted}
//                   error={errors.period}
//                   preselectedOptions={
//                     mode === 'edit'
//                       ? [
//                           {
//                             name: formData.period?.name,
//                             id: formData.period?.id
//                           }
//                         ]
//                       : []
//                   }
//                 />
//               </div>
//             </Col>
//           </Row>
//           {mode === 'add' ? (
//             <Col md='12' className='d-flex justify-content-end'>
//               <Row className='m-0 col-5 justify-content-evenly'>
//                 <SubmitButton
//                   text={'CANCEL'}
//                   width={'100px'}
//                   background={'transparent'}
//                   color={'#000'}
//                   border={'1px solid #ccc'}
//                   onClick={() => onHide()}
//                 />
//                 <SubmitButton
//                   onClick={submitHandler}
//                   text={
//                     loading ? (
//                       <span className='spinner-border spinner-border-sm' />
//                     ) : (
//                       'ADD STUDENT'
//                     )
//                   }
//                   background={'#52C7DE'}
//                   color={'#fff'}
//                   border={'none'}
//                 />
//               </Row>
//             </Col>
//           ) : (
//             <Row className='justify-content-between py-3 edit-actions__details'>
//               <span className='col-6 d-flex align-items-center'>
//                 <p
//                   href='#'
//                   className='m-0 cursor-pointer'
//                   onClick={deleteUserFromEdit}
//                 >
//                   <FontAwesomeIcon icon={faUserMinus} className='pe-2' />
//                   Delete User
//                 </p>
//               </span>
//               <span className='col-6 d-flex align-items-center justify-content-end'>
//                 <p
//                   href='#'
//                   className='m-0 cursor-pointer'
//                   onClick={resetPasswordFromEdit}
//                 >
//                   <FontAwesomeIcon icon={faUserLock} className='pe-2' />
//                   Reset password
//                 </p>
//               </span>
//             </Row>
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   )
// }

// export default StudentActionsModal
