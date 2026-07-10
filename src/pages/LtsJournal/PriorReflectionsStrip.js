import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'

function decodeHtmlEntities(value) {
  if (value == null || value === '') return ''
  const text = String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
  if (typeof document === 'undefined') {
    return text
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, "'")
      .trim()
  }
  const el = document.createElement('textarea')
  el.innerHTML = text
  return (el.value || '').trim()
}

function PriorReflectionsStrip({ lessonIds }) {
  const [groups, setGroups] = useState([])
  const [openGroupId, setOpenGroupId] = useState(null)
  const [loading, setLoading] = useState(false)

  const idsKey = Array.isArray(lessonIds) ? lessonIds.join(',') : ''

  useEffect(() => {
    if (!idsKey) {
      setGroups([])
      setOpenGroupId(null)
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
          const normalized = (Array.isArray(data) ? data : []).map((group) => {
            const reflections = (group.reflections || []).map((reflection) => {
              const answer = decodeHtmlEntities(reflection.answer)
              return {
                ...reflection,
                question: decodeHtmlEntities(reflection.question),
                answer,
                hasAnswer: Boolean(answer)
              }
            })
            return {
              ...group,
              title: decodeHtmlEntities(group.title),
              reflections
            }
          })
          setGroups(normalized)
          setOpenGroupId(null)
        }
      } catch {
        if (!cancelled) {
          setGroups([])
          setOpenGroupId(null)
        }
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

  if (loading && groups.length === 0) {
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

  if (groups.length === 0) return null

  const openGroup = groups.find((group) => group.journalId === openGroupId)
  const toggleGroup = (journalId) => {
    setOpenGroupId((prev) => (prev === journalId ? null : journalId))
  }

  return (
    <div className='lts-prior-strip'>
      <div className='lts-prior-strip-label'>
        Reflections that built this task
      </div>
      <div className='lts-prior-chips'>
        {groups.map((group) => {
          const reflections = group.reflections || []
          const hasAnyAnswer = reflections.some((r) => r.hasAnswer)
          const isOpen = openGroupId === group.journalId

          return (
            <button
              key={group.journalId}
              type='button'
              className={`lts-prior-chip${isOpen ? ' open' : ''}`}
              onClick={() => toggleGroup(group.journalId)}
              title={group.title}
            >
              {hasAnyAnswer && (
                <img className='lts-prior-chip-check' src={tickSign} alt='' />
              )}
              <span className='lts-prior-chip-label'>{group.title}</span>
              <span className='lts-prior-chip-caret'>{isOpen ? '▴' : '▾'}</span>
            </button>
          )
        })}
      </div>
      {openGroup && (
        <div className='lts-prior-detail open'>
          {(openGroup.reflections || []).map((reflection) => (
            <div key={reflection.id} className='lts-prior-detail-item'>
              <div className='lts-prior-detail-q'>{reflection.question}</div>
              <div className='lts-prior-detail-a'>
                {reflection.answer || 'No response yet.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PriorReflectionsStrip
