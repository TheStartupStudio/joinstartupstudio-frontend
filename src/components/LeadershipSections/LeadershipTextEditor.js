import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import AddDoc from '../../assets/images/academy-icons/add-doc.png'
import axiosInstance from '../../utils/AxiosInstance'
import { debounce } from 'lodash'

function LeadershipTextEditor({ title, id, journalId, onContentChange, userAnswers, order = 0, showControls = false }) {
  const [reflections, setReflections] = useState([])
  const [startDate, setStartDate] = useState('')
  const [editDate, setEditDate] = useState('')
  
  // Create debounced versions of date updates
  const debouncedStartDateUpdate = debounce((currentDate) => {
    setStartDate(currentDate)
  }, 2000)

  const debouncedEditDateUpdate = debounce((currentDate) => {
    setEditDate(currentDate) 
  }, 2000)

  useEffect(() => {
    const resizeObserverError = window.ResizeObserver.prototype.observe
    window.ResizeObserver.prototype.observe = function (target) {
      try {
        return resizeObserverError.call(this, target)
      } catch (error) {
        if (error instanceof Error && !error.message.includes('loop completed with undelivered notifications')) {
          throw error
        }
      }
    }

    return () => {
      window.ResizeObserver.prototype.observe = resizeObserverError
    }
  }, [])

  useEffect(() => {
    if (userAnswers && userAnswers.length > 0) {
      const sortedAnswers = [...userAnswers].sort((a, b) => a.order - b.order)

      setReflections(sortedAnswers.map(answer => ({
        id: answer.id, // Keep existing IDs for saved reflections
        content: answer.content,
        isExisting: true,
        order: answer.order || 0,
        questionId: id
      })))
      setStartDate(new Date(userAnswers[0].createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      setEditDate(new Date(userAnswers[0].updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    } else {
      setReflections([{ 
        id: `${id}-${Date.now()}`, // Unique ID for initial reflection
        content: '', 
        isExisting: false,
        order: 0,
        questionId: id
      }])
    }
  }, [userAnswers, id])

  const handleAddReflection = () => {
    const questionReflections = reflections.filter(r => r.questionId === id)
    const newOrder = questionReflections.length

    // Generate a unique ID for each reflection
    const newReflection = {
      id: `${id}-${Date.now()}`, // Make unique ID by combining question ID and timestamp
      content: '',
      isExisting: false,  
      order: newOrder,
      questionId: id
    }
    setReflections([...reflections, newReflection])
  }

  const handleRemoveReflection = async (reflectionId, isExisting) => {
    try {
      if (isExisting) {
        await axiosInstance.delete(`/ltsJournals/ltsjournalEntries/${journalId}/${reflectionId}`)
      }

      const updatedReflections = reflections.filter(r => r.id !== reflectionId)
      const questionReflections = updatedReflections.filter(r => r.questionId === id)
      
      const reorderedReflections = updatedReflections.map(r => {
        if (r.questionId === id) {
          const index = questionReflections.indexOf(r)
          return { ...r, order: index }
        }
        return r
      })

      setReflections(reorderedReflections)
    } catch (error) {
      console.error('Error removing reflection:', error)
    }
  }

  const handleContentChange = (reflectionId, content) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });

    if (!startDate && content.trim()) {
      // Use debounced version for start date
      debouncedStartDateUpdate(currentDate);
    }
    
    // Use debounced version for edit date
    debouncedEditDateUpdate(currentDate);

    setReflections(prev => prev.map(r =>
      r.id === reflectionId ? { ...r, content } : r
    ));
    
    const reflection = reflections.find(r => r.id === reflectionId);
    onContentChange(reflectionId, {
      content,
      isExisting: reflection?.isExisting,
      order: reflection?.order,
      questionId: id
    });
  }

  // Clear both debounce timers on unmount
  useEffect(() => {
    return () => {
      debouncedStartDateUpdate.cancel();
      debouncedEditDateUpdate.cancel();
    };
  }, []);

  const questionReflections = reflections.filter(r => r.questionId === id)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      <h3 className='fs-18 fw-medium text-black'>{title}</h3>
      <div className='d-flex gap-3 mb-2'>
        <div className='gray-leadership fs-13'>
          <span className='fw-medium'>Started:</span>
          <span className='fw-light'> {startDate || 'Not started'}</span>
        </div>
        <div className='gray-leadership fs-13'>
          <span className='fw-medium'>Edited:</span>
          <span className='fw-light'> {editDate || 'Not edited'}</span>
        </div>
      </div>
      <div></div>
      {questionReflections.map((reflection, index) => (
        <div key={reflection.id} className='reflection-container mb-4'>
          <ReactQuill
            value={reflection.content}
            onChange={(value) => handleContentChange(reflection.id, value)}
            className='my-quill-editor'
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image']
              ]
            }}
          />

          {showControls && (
            <div className='d-flex mt-2 justify-content-between reflection-controls'>
              <div
                className={`d-flex gap-2 align-items-center ${
                  reflection.id === questionReflections[0].id ? 'visibility-hidden' : ''
                }`}
              >
                <p
                  className='mb-0 fs-15 fw-medium cursor-pointer add-reflection'
                  onClick={() => handleRemoveReflection(reflection.id, reflection.isExisting)}
                >
                  Remove the reflection
                </p>
                <img src={AddDoc} alt='add-doc' />
              </div>
              <div className='d-flex gap-2 align-items-center'>
                <p
                  className='mb-0 fs-15 fw-medium cursor-pointer add-reflection'
                  onClick={handleAddReflection}
                >
                  Add new reflection
                </p>
                <img src={AddDoc} alt='add-doc' />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default LeadershipTextEditor
