// Content filtering utility for detecting inappropriate content
// Categorized by severity level:
// Level 1: Auto-Remove (blocking, no dismiss) - Uses entire foul-words.json list
// Level 2: Flag for Review (send to admin)
// Level 3: Soft Flag (warning with acknowledgment)

import foulWords from '../assets/json/foul-words.json'

const contentFilterData = {
  level1: foulWords, // Use all words from foul-words.json as Level 1 (blocking)
  
  level2: [
    // Profanity
    'jerk',
    
    // Violence
    'die',
    'self-harm',
    
    // Bullying
    'stupid',
    'dumb',
    'ugly',
    'freak',
    'loser',
    'idiot',
    'moron',
    'fat',
    'anorexic',
    'pathetic',
    'you\'re worthless',
    'you\'re nothing',
    'shut up',
    'nobody likes you',
    'go away',
    'you\'re annoying',
    'you\'ll never make it',
    'you\'re fake',
    'this sucks',
    'this is stupid',
    
    // Contextual
    'go die',
    'no one likes you',
    'you don\'t belong here',
    'you\'re not welcome',
    'you\'ll fail',
    'you can\'t do anything right',
  ],
  
  level3: [
    // Sensitive
    'depressed',
    'anxious',
    'panic',
    'scared',
    'sad',
    'hopeless',
    'alone',
    'hurt myself',
    'hate myself',
    'nobody loves me',
    'cutting',
    'crying',
    'mental breakdown',
    'suicide',
    'worthless',
    
    // Contextual
    'I hate myself',
    'I want to die',
    'I want to hurt myself',
  ]
}

/**
 * Check text content for inappropriate words/phrases
 * @param {string} text - The text to check
 * @returns {Object} - { level: number, found: string[] } or null if clean
 */
export const checkContent = (text) => {
  if (!text) return null
  
  // Strip HTML tags and normalize text
  const strippedText = text.replace(/<[^>]*>/g, ' ').toLowerCase()
  
  // Check Level 1 (highest severity) first - all foul words
  const level1Found = []
  for (const word of contentFilterData.level1) {
    // Escape special regex characters except spaces
    const escapedWord = word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'i')
    if (regex.test(strippedText)) {
      level1Found.push(word)
    }
  }
  
  if (level1Found.length > 0) {
    return { level: 1, found: level1Found }
  }
  
  // Check Level 2
  const level2Found = []
  for (const phrase of contentFilterData.level2) {
    const regex = new RegExp(phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    if (regex.test(strippedText)) {
      level2Found.push(phrase)
    }
  }
  
  if (level2Found.length > 0) {
    return { level: 2, found: level2Found }
  }
  
  // Check Level 3
  const level3Found = []
  for (const phrase of contentFilterData.level3) {
    const regex = new RegExp(phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    if (regex.test(strippedText)) {
      level3Found.push(phrase)
    }
  }
  
  if (level3Found.length > 0) {
    return { level: 3, found: level3Found }
  }
  
  return null
}

/**
 * Get the appropriate action description for each level
 */
export const getLevelDescription = (level) => {
  const descriptions = {
    1: 'This content contains inappropriate language and cannot be posted.',
    2: 'This content will be flagged for review by our administrators.',
    3: 'This content may be sensitive. Please ensure it follows our community guidelines.'
  }
  return descriptions[level] || ''
}

export default {
  checkContent,
  getLevelDescription
}
