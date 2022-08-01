import { useEffect, useState } from 'react'
import './index.css'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import { useSelector } from 'react-redux'
import { detectFoulWords, removeHtmlFromString } from '../../utils/helpers'
import FoulWords from '../../utils/FoulWords'
import { USER_CONTACT_FORM } from '../../utils/constants'
import { useForm } from 'react-hook-form'

const UserContactForm = (props) => {
  const [loading, setLoading] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [foulWords, setFoulWords] = useState(null)
  const [formRef, setFormRef] = useState(null)

  const user = useSelector((state) => state.user.user.user)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm()
  const watchFields = watch(['email', 'message'])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        detectFoulWords(removeHtmlFromString(value.message), (data) => {
          setFoulWords(data)
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    axiosInstance
      .get('/users/instructors')
      .then((res) => setInstructors(res.data.instructors))
  }, [])

  const sendEmail = async (data) => {
    if (loading) return
    setLoading(true)

    if (foulWords) {
      await FoulWords.register(user.id, foulWords, USER_CONTACT_FORM)
      setFoulWords(null)
    }

    axiosInstance
      .post('/users/contact-user', {
        email: data.email,
        message: data.message
      })
      .then((res) => {
        setLoading(false)
        reset({
          email: '',
          message: ''
        })
        formRef.reset()
        toast.success(res.data.message)
      })
      .catch((err) => {
        setLoading(false)
        toast.error('Error sending email!')
      })
  }

  return (
    <div className='user-contact-form px-3 py-4 my-4'>
      <h3 className='text-lg-center'>Contact</h3>
      <form
        onSubmit={handleSubmit(sendEmail)}
        id='userContactForm'
        ref={(e) => setFormRef(e)}
      >
        <div>
          <select
            name='email_to'
            className='w-100 p-2'
            {...register('email', {
              required: true
            })}
          >
            <option value=''>Send email to...</option>
            {instructors.map((instructor) => (
              <option value={instructor?.User?.email} key={instructor.id}>
                {instructor?.User?.name}
              </option>
            ))}
          </select>
          <span className='field-error'>
            {errors.email && 'This field is required'}
          </span>
        </div>
        <div>
          <textarea
            name='message'
            className='w-100 p-2 mt-3'
            rows='10'
            placeholder='Message...'
            {...register('message', {
              required: true
            })}
          ></textarea>
          <span className='field-error'>
            {errors.message && 'Message is required'}
          </span>
        </div>
        <div>
          <button type='submit' className='lts-button w-100 mt-2'>
            {loading ? (
              <IntlMessages id='general.loading' />
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>

        {foulWords && (
          <div className='p-2 foul-words-notice'>
            <IntlMessages id='foul_words.notice' />
          </div>
        )}
      </form>
    </div>
  )
}

export default UserContactForm
