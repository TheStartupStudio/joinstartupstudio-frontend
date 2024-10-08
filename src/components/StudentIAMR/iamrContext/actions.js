import { useCallback, useMemo } from 'react'

export const UseIamrActions = (state, dispatch) => {
  const setSkills = useCallback(
    (payload) => {
      dispatch({ type: 'SET_SKILLS', payload })
    },
    [dispatch]
  )

  const setJournalEntries = useCallback(
    (payload) => {
      dispatch({ type: 'SET_JOURNAL_ENTRIES', payload })
    },
    [dispatch]
  )

  const findOneSkill = useCallback(
    (id) => {
      return state.skills.find((skill) => skill.id == id)
    },
    [state.skills]
  )

  const updateSkillStatus = useCallback(
    (payload) => {
      dispatch({
        type: 'UPDATE_SKILL_STATUS',
        payload: payload
      })
    },
    [dispatch]
  )

  const setCertificationOneStatus = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_CERTIFICATION_ONE_STATUS',
        payload: payload
      })
    },
    [dispatch]
  )

  const setCertificationTwoStatus = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_CERTIFICATION_TWO_STATUS',
        payload: payload
      })
    },
    [dispatch]
  )

  const setStudent = useCallback(
    (payload) => {
      dispatch({
        type: 'SET_STUDENT',
        payload: payload
      })
    },
    [dispatch]
  )

  const setLoading = useCallback(
    (payload) => {
      dispatch({ type: 'SET_LOADING', payload })
    },
    [dispatch]
  )

  return useMemo(() => {
    return {
      setSkills,
      updateSkillStatus,
      findOneSkill,
      setJournalEntries,
      setCertificationOneStatus,
      setCertificationTwoStatus,
      setStudent,
      setLoading
    }
  }, [
    setSkills,
    updateSkillStatus,
    findOneSkill,
    setJournalEntries,
    setCertificationOneStatus,
    setCertificationTwoStatus,
    setStudent,
    setLoading
  ])
}
