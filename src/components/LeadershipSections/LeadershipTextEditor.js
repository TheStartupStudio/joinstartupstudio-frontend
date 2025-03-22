import { useState } from 'react'
import ReactQuill from 'react-quill'
import AddDoc from '../../assets/images/academy-icons/add-doc.png'

function LeadershipTextEditor({ title }) {
  const [reflections, setReflections] = useState([{ id: 1, content: '' }])

  const handleAddReflection = () => {
    const newReflection = { id: Date.now(), content: '' }
    setReflections([...reflections, newReflection])
  }

  const handleRemoveReflection = (id) => {
    setReflections(reflections.filter((reflection) => reflection.id !== id))
  }

  const handleContentChange = (id, value) => {
    setReflections(
      reflections.map((reflection) =>
        reflection.id === id ? { ...reflection, content: value } : reflection
      )
    )
  }

  return (
    <>
      <h3 className='fs-18 fw-medium text-black'>{title}</h3>
      <div className='d-flex gap-3 mb-2'>
        <div className='gray-leadership fs-13 '>
          <span className='fw-medium'>Started:</span>
          <span className='fw-light'> Sept. 21, 2025 20:56</span>
        </div>
        <div className='gray-leadership fs-13 '>
          <span className='fw-medium'>Edited:</span>
          <span className='fw-light'> Sept. 21, 2025 20:56</span>
        </div>
      </div>
      <div></div>
      {reflections.map((reflection, index) => (
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

          <div className='d-flex mt-2 justify-content-between'>
            <div
              className={`d-flex gap-2 align-items-center ${
                reflection.id === reflections[0].id ? 'visibility-hidden' : ''
              }`}
            >
              <p
                className='mb-0 fs-15 fw-medium cursor-pointer add-reflection'
                onClick={() => handleRemoveReflection(reflection.id)}
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
        </div>
      ))}
    </>
  )
}

export default LeadershipTextEditor
