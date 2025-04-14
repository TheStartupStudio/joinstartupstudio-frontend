import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactQuill from 'react-quill'
import AddDoc from '../../assets/images/academy-icons/add-doc.png'
import Light from '../../assets/images/academy-icons/light.png'
import SectionsWrapper from './SectionsWrapper'
import LeadershipTextEditor from './LeadershipTextEditor'
import axiosInstance from '../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { getJournalData } from '../../redux/journal/Actions'

const Value = forwardRef(({ id, setIsReflection }, ref) => {
  const [pendingChanges, setPendingChanges] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)
  const dispatch = useDispatch()
  const { journalData, loading, error } = useSelector((state) => state.journal)

  const refreshData = () => {
    dispatch(getJournalData(id))
  }

  useEffect(() => {
    refreshData()
  }, [id, refreshKey])

  const handleContentChange = (entryId, data) => {
    console.log('Received data:', data)
    setPendingChanges((prev) => ({
      ...prev,
      [entryId]: {
        content: data.content,
        isExisting: data.isExisting,
        journalId: id,
        entryId: entryId,
        order: typeof data.order === 'number' ? data.order : 0
      }
    }))
  }

  useImperativeHandle(ref, () => ({
    saveChanges: async () => {
      try {
        const savePromises = Object.entries(pendingChanges).map(
          async ([entryId, data]) => {
            try {
              const postResponse = await axiosInstance.post(
                `/ltsJournals/ltsjournalEntries/${id}/${entryId}`,
                {
                  content: data.content,
                  order: data.order
                }
              )
              console.log('POST success:', postResponse)
              refreshData()
              return postResponse
            } catch (postError) {
              console.log('POST failed, trying PUT:', postError)

              if (postError.response?.status === 400 || data.isExisting) {
                const putResponse = await axiosInstance.put(
                  `/ltsJournals/ltsjournalEntries/${id}/${entryId}`,
                  {
                    content: data.content,
                    order: data.order
                  }
                )
                console.log('PUT success:', putResponse)
                refreshData()
                return putResponse
              }

              throw postError
            }
          }
        )

        await Promise.all(savePromises)
        setPendingChanges({})
        setRefreshKey((prev) => prev + 1)
      } catch (error) {
        console.error('Error saving reflections:', error)
      }
    }
  }))

  setIsReflection(true)

  return (
    <div className='d-grid grid-col-2 gap-4 grid-col-1-mob'>
      <SectionsWrapper title={journalData?.title}>
        <div dangerouslySetInnerHTML={{ __html: journalData?.content }} />
      </SectionsWrapper>

      <SectionsWrapper img={Light} title={'Reflection'}>
        {journalData?.entries.map((item, index) => (
          <LeadershipTextEditor
            key={item.id}
            title={item.title}
            id={item.id}
            journalId={id}
            onContentChange={handleContentChange}
            userAnswers={item.userAnswers}
            order={index}
          />
        ))}
      </SectionsWrapper>
    </div>
  )
})

export default Value
