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

/** Prefer exact journal id over redirectId (redirectId is often id + 1). */
export function findLessonIndex(lessons, lessonId) {
  const numericId = parseInt(lessonId, 10)
  if (Number.isNaN(numericId)) return -1

  const byId = lessons.findIndex((l) => l.id === numericId)
  if (byId !== -1) return byId

  return lessons.findIndex((l) => l.redirectId === numericId)
}

/** All non-task lessons between the previous task and this task (inclusive of section intros). */
export function getLessonsBuildingTowardTask(taskLessonId, lessons) {
  const taskIndex = findLessonIndex(lessons, taskLessonId)
  if (taskIndex === -1 || !isTaskLesson(lessons[taskIndex])) return []

  let startIndex = 0
  for (let i = taskIndex - 1; i >= 0; i--) {
    if (isTaskLesson(lessons[i])) {
      startIndex = i + 1
      break
    }
  }

  const result = []
  for (let i = startIndex; i < taskIndex; i++) {
    const lesson = lessons[i]
    if (!isSeparatorLesson(lesson) && !isTaskLesson(lesson)) {
      result.push(lesson)
    }
  }
  return result
}

/**
 * Build nav items grouped by task: every lesson before a task builds toward it.
 * Structure: [buildingGroup → task] [buildingGroup → task] …
 */
export function buildNavItems(lessons) {
  const items = []
  let pendingLessons = []

  const flushBuildingGroup = (targetTask) => {
    if (pendingLessons.length === 0) return
    items.push({
      type: 'buildingGroup',
      buildsToward: targetTask,
      lessons: [...pendingLessons]
    })
    pendingLessons = []
  }

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]

    if (lesson.isWelcomeOption) continue

    if (isSeparatorLesson(lesson)) continue

    if (isTaskLesson(lesson)) {
      flushBuildingGroup(lesson)
      if (items.length > 0) {
        items.push({ type: 'divider' })
      }
      items.push({ type: 'task', lesson })
      continue
    }

    pendingLessons.push(lesson)
  }

  return items
}

export function getBuildsTowardTask(lessonId, lessons) {
  const index = findLessonIndex(lessons, lessonId)
  if (index === -1) return null
  return findNextTask(lessons, index)
}

export function getPriorReflectionLessons(currentLessonId, lessons) {
  const currentIndex = findLessonIndex(lessons, currentLessonId)
  if (currentIndex === -1 || !isTaskLesson(lessons[currentIndex])) return []
  return getLessonsBuildingTowardTask(currentLessonId, lessons)
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
