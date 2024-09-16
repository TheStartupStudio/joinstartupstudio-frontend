import { useState } from 'react'

const useModalState = () => {
  const [modals, setModals] = useState({
    showAddInstructorModal: false,
    showAddInstructorBulkModal: false,
    showAddStudentsBulkModal: false,
    editInstructorModal: false,
    resetPasswordModal: false,
    deleteUserModal: false,
    showBulkEditModal: false,
    showBulkDeactivationModal: false,
    showBulkNextYearModal: false,
    showConfirmationModal: false,
    studentEditActionModal: false,
    studentAddActionModal: false,
    trasnferStudentsModal: false,
    addCoursesVCredentialModal: false,
    editCoursesVCredentialModal: false,
    viewCoursesVCredentialModal: false,
    removeCoursesVCredentialModal: false,
    viewApplicationModal: false,
    transferAcademyUserModal: false,
    archiveApplicationModal: false
  })

  const setModalState = (modalName, value) => {
    setModals((prevState) => ({ ...prevState, [modalName]: value }))
  }

  return [modals, setModalState]
}

export default useModalState
