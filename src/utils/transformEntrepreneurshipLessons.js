export function transformEntrepreneurshipLessons(responseData) {
  if (!responseData) return {}

  const transformedLessons = {}

  Object.keys(responseData).forEach((key) => {
    const numericKey = parseInt(key)
    if (isNaN(numericKey)) return

    if (numericKey === 2) {
      const level2Lessons = responseData[key] || []
      const nestedLessons = []
      let currentSection = null

      level2Lessons.forEach((lesson) => {
        if (lesson.separate) {
          if (currentSection) {
            nestedLessons.push(currentSection)
          }
          currentSection = {
            id: lesson.id || lesson.redirectId || 0,
            title: lesson.title || '',
            isParent: true,
            children: []
          }
        } else if (currentSection) {
          currentSection.children.push({
            id: lesson.id || lesson.redirectId || 0,
            title: lesson.title || '',
            status: lesson.status || 'notStarted',
            redirectId: lesson.redirectId || parseInt(lesson.id) || 0
          })
        } else {
          nestedLessons.push({
            id: lesson.id || lesson.redirectId || 0,
            title: lesson.title || '',
            status: lesson.status || 'notStarted',
            redirectId: lesson.redirectId || parseInt(lesson.id) || 0
          })
        }
      })

      if (currentSection) {
        nestedLessons.push(currentSection)
      }

      transformedLessons[numericKey] = nestedLessons
      return
    }

    transformedLessons[numericKey] = (responseData[key] || []).map((lesson) => ({
      id: lesson.id || lesson.redirectId || 0,
      title: lesson.title || '',
      status: lesson.status || 'notStarted',
      redirectId: lesson.redirectId || parseInt(lesson.id) || 0
    }))
  })

  return transformedLessons
}
