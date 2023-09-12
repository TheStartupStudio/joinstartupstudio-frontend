const IamrReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case 'SET_SKILLS':
      return { ...state, skills: payload, loading: false }
    case 'SET_JOURNAL_ENTRIES':
      return { ...state, journalEntries: payload }
    case 'SET_LOADING':
      return { ...state, loading: payload }
    case 'UPDATE_SKILL_STATUS':
      return {
        ...state,
        skills: state.skills.map((skill) =>
          skill.id === payload.skill_id
            ? { ...skill, SkillStatus: payload }
            : skill
        )
      }

    default:
      return
  }
}

export default IamrReducer
