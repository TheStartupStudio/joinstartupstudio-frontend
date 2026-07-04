export function isTaskLesson(lesson) {
  if (!lesson?.title) return false
  return lesson.title.toLowerCase().includes('task')
}

export function isSeparatorLesson(lesson) {
  return lesson?.separate === true || lesson?.isSeparator === true
}

function normalizeLesson(lesson) {
  if (!lesson) return null

  const id =
    lesson.id ??
    lesson.redirectId ??
    lesson.value ??
    lesson.lessonId ??
    null

  const title = (
    lesson.title ||
    lesson.label ||
    lesson.video?.title ||
    ''
  ).trim()

  if (id == null || id === '' || !title) return null

  return {
    ...lesson,
    id: Number(id) || id,
    redirectId: lesson.redirectId ?? lesson.id ?? id,
    title,
    separate: Boolean(lesson.separate || lesson.isSeparator)
  }
}

/** Flatten nested level-2 style lesson trees into a single ordered list. */
function flattenLessons(raw) {
  if (!raw || !Array.isArray(raw)) return []

  const result = []

  raw.forEach((item) => {
    if (!item) return

    if (item.isParent && Array.isArray(item.children)) {
      const parent = normalizeLesson({
        ...item,
        separate: true
      })
      if (parent) result.push(parent)
      item.children.forEach((child) => {
        const normalized = normalizeLesson(child)
        if (normalized) result.push(normalized)
      })
      return
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      const parent = normalizeLesson(item)
      if (parent) result.push({ ...parent, separate: true })
      item.children.forEach((child) => {
        const normalized = normalizeLesson(child)
        if (normalized) result.push(normalized)
      })
      return
    }

    const normalized = normalizeLesson(item)
    if (normalized) result.push(normalized)
  })

  return result
}

export function getLessonsForLevel(lessonsByLevel, activeLevel) {
  if (!lessonsByLevel) return []

  const raw =
    lessonsByLevel[activeLevel] ??
    lessonsByLevel[String(activeLevel)] ??
    []

  return flattenLessons(raw)
}

export function findNextTask(lessons, fromIndex) {
  for (let i = fromIndex + 1; i < lessons.length; i++) {
    const lesson = lessons[i]
    if (isSeparatorLesson(lesson)) continue
    if (isTaskLesson(lesson)) return lesson
  }
  return null
}

export function findPreviousTask(lessons, fromIndex) {
  for (let i = fromIndex - 1; i >= 0; i--) {
    const lesson = lessons[i]
    if (isSeparatorLesson(lesson)) continue
    if (isTaskLesson(lesson)) return lesson
  }
  return null
}

/**
 * Build flat nav items for the left panel.
 * Parent lessons (section anchors) get nested reflection children until the next task/divider.
 */
export function buildNavItems(lessons) {
  const items = []
  let reflectionBuffer = []
  let sectionParent = null

  const flushReflections = () => {
    if (reflectionBuffer.length > 0) {
      items.push({ type: 'reflectionGroup', reflections: [...reflectionBuffer] })
      reflectionBuffer = []
    }
  }

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]

    if (lesson.isWelcomeOption) continue

    if (isSeparatorLesson(lesson)) {
      flushReflections()
      sectionParent = null
      items.push({ type: 'divider' })
      continue
    }

    if (isTaskLesson(lesson)) {
      flushReflections()
      sectionParent = null
      const hasNavContent = items.some(
        (item) =>
          item.type === 'task' ||
          item.type === 'parent' ||
          item.type === 'reflectionGroup'
      )
      if (hasNavContent) {
        items.push({ type: 'divider' })
      }
      items.push({
        type: 'task',
        lesson,
        buildsToward: findNextTask(lessons, i)
      })
      continue
    }

    if (!sectionParent) {
      flushReflections()
      sectionParent = lesson
      items.push({ type: 'parent', lesson })
      continue
    }

    reflectionBuffer.push({
      lesson,
      buildsToward: findNextTask(lessons, i)
    })
  }

  flushReflections()
  return items
}

export function getBuildsTowardTask(lessonId, lessons) {
  const numericId = parseInt(lessonId)
  const index = lessons.findIndex(
    (l) => l.id === numericId || l.redirectId === numericId
  )
  if (index === -1) return null
  return findNextTask(lessons, index)
}

export function getPriorReflectionLessons(currentLessonId, lessons) {
  const numericId = parseInt(currentLessonId)
  const currentIndex = lessons.findIndex(
    (l) => l.id === numericId || l.redirectId === numericId
  )
  if (currentIndex === -1) return []

  const currentLesson = lessons[currentIndex]
  if (!isTaskLesson(currentLesson)) return []

  let startIndex = 0
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (isTaskLesson(lessons[i])) {
      startIndex = i + 1
      break
    }
  }

  const prior = []
  for (let i = startIndex; i < currentIndex; i++) {
    const lesson = lessons[i]
    if (isSeparatorLesson(lesson) || isTaskLesson(lesson)) continue
    prior.push(lesson)
  }

  return prior
}

export function getGroupTitle(levels, activeLevel, lessons) {
  if (levels[activeLevel]?.title) {
    const levelTitle = levels[activeLevel].title
    if (levelTitle.includes(':')) {
      return levelTitle.split(':').slice(1).join(':').trim()
    }
    return levelTitle
  }

  const first = lessons.find((l) => !isSeparatorLesson(l) && !isTaskLesson(l))
  return first?.title || 'Lessons'
}
