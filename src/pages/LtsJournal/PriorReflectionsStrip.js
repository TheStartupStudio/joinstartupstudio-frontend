import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'

function PriorReflectionsStrip({ lessonIds }) {
  const [reflectionData, setReflectionData] = useState([])
  const [openChipId, setOpenChipId] = useState(null)
  const [loading, setLoading] = useState(false)

  const idsKey = Array.isArray(lessonIds) ? lessonIds.join(',') : ''

  useEffect(() => {
    if (!idsKey) {
      setReflectionData([])
      return
    }

    let cancelled = false

    async function loadPriorReflections() {
      setLoading(true)
      try {
        const { data } = await axiosInstance.get(
          '/ltsJournals/entrepreneurship/prior-reflections',
          { params: { ids: idsKey } }
        )

        if (!cancelled) {
          const chips = (data || []).flatMap((group) => group.reflections || [])
          setReflectionData(chips)
        }
      } catch {
        if (!cancelled) setReflectionData([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPriorReflections()
    return () => {
      cancelled = true
    }
  }, [idsKey])

  if (!idsKey) return null

  if (loading && reflectionData.length === 0) {
    return (
      <div className='lts-prior-strip'>
        <div className='lts-prior-strip-label'>
          Reflections that built this task
        </div>
        <div className='lts-prior-chips'>
          <span className='lts-prior-loading'>Loading reflections…</span>
        </div>
      </div>
    )
  }

  if (reflectionData.length === 0) return null

  const toggleChip = (chipId) => {
    setOpenChipId((prev) => (prev === chipId ? null : chipId))
  }

  return (
    <div className='lts-prior-strip'>
      <div className='lts-prior-strip-label'>
        Reflections that built this task
      </div>
      <div className='lts-prior-chips'>
        {reflectionData.map((chip) => (
          <button
            key={chip.id}
            type='button'
            className={`lts-prior-chip${openChipId === chip.id ? ' open' : ''}`}
            onClick={() => toggleChip(chip.id)}
          >
            {chip.hasAnswer && (
              <img className='lts-prior-chip-check' src={tickSign} alt='' />
            )}
            <span>{chip.question}</span>
            <span className='lts-prior-chip-caret'>
              {openChipId === chip.id ? '▴' : '▾'}
            </span>
          </button>
        ))}
      </div>
      {reflectionData.map((chip) =>
        openChipId === chip.id ? (
          <div key={`detail-${chip.id}`} className='lts-prior-detail open'>
            <div className='lts-prior-detail-q'>{chip.question}</div>
            <div className='lts-prior-detail-a'>
              {chip.answer || 'No response yet.'}
            </div>
          </div>
        ) : null
      )}
    </div>
  )
}

export default PriorReflectionsStrip
