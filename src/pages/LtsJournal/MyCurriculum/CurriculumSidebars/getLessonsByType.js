const getLessonByType = (lessons, journalItem, type) => {
  if (type === 'task') {
    return {
      hasLesson: lessons.some(
        (lesson) => lesson.taskJournalId === journalItem.id
      ),
      lesson: lessons.find((lesson) => lesson.taskJournalId === journalItem.id)
    }
  } else if (type === 'week') {
    return {
      hasLesson: lessons.some(
        (lesson) => lesson.weekJournalId === journalItem.id
      ),
      lesson: lessons.find((lesson) => lesson.weekJournalId === journalItem.id)
    }
  }
  return { hasLesson: false, lesson: null }
}

export default getLessonByType
