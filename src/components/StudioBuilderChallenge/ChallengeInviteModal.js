import React, { useState } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import { fetchChallengeProgressStart } from '../../redux/studioChallenge/Actions'
import { sendFriendInviteViaConvertKit } from '../../utils/convertkitInvite'
import ModalInput from '../ModalInput/ModalInput'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import inviteIcon from '../../assets/images/academy-icons/svg/user-group-add.svg'

function ChallengeInviteModal({ show, onHide }) {
  const dispatch = useDispatch()
  const [friendName, setFriendName] = useState('')
  const [friendEmail, setFriendEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFriendName('')
    setFriendEmail('')
  }

  const handleClose = () => {
    if (loading) return
    resetForm()
    onHide()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = friendName.trim()
    const trimmedEmail = friendEmail.trim().toLowerCase()

    if (!trimmedName || !trimmedEmail) {
      toast.error("Please enter your friend's name and email")
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      await sendFriendInviteViaConvertKit({
        friendName: trimmedName,
        friendEmail: trimmedEmail
      })

      await axiosInstance.post('/challenge/complete', {
        taskKey: 'invite_sent'
      })

      dispatch(fetchChallengeProgressStart({ force: true, silent: true }))
      toast.success('Invite sent successfully!')
      resetForm()
      onHide()
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send invite. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={show}
      toggle={handleClose}
      size='sm'
      style={{ maxWidth: '600px', width: '100%' }}
    >
      <ModalBody>
        <img
          className='modal-credit rounded-circle p-2 mb-2'
          src={inviteIcon}
          alt='Invite'
        />
        <p className='mb-0 fs-15 fw-medium'>Invite a friend to The Studio</p>

        <form onSubmit={handleSubmit}>
          <div className='mt-5'>
            <p className='fs-14 fw-light text-secondary mb-4'>
              Enter your friend&apos;s name and email and we&apos;ll send them an
              invite to join The Studio.
            </p>
            <div className='d-flex flex-column gap-3'>
              <ModalInput
                id='challenge-invite-name'
                labelTitle="Friend's name"
                imgSrc={penIcon}
                value={friendName}
                onChange={(event) => setFriendName(event.target.value)}
              />
              <ModalInput
                id='challenge-invite-email'
                labelTitle="Friend's email"
                type='email'
                imgSrc={penIcon}
                value={friendEmail}
                onChange={(event) => setFriendEmail(event.target.value)}
                autoComplete='email'
              />
            </div>
          </div>

          <div className='d-flex gap-3 justify-content-center mt-5'>
            <Button
              type='button'
              className='close-btn'
              onClick={handleClose}
              disabled={loading}
            >
              CANCEL
            </Button>
            <button
              type='submit'
              className='modal-save-btn'
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'SEND INVITE'}
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default ChallengeInviteModal
