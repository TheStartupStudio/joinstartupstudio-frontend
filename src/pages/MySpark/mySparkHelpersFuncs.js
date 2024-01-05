import articleIcon from '../../assets/images/My Spark Widget Icons/Blue background/1. Article.png'
import aboutUsIcon from '../../assets/images/My Spark Widget Icons/Blue background/2. About us.png'
import faqIcon from '../../assets/images/My Spark Widget Icons/Blue background/3. FAQ.png'
import startUpNamesIcon from '../../assets/images/My Spark Widget Icons/Blue background/4. Startup names.png'
import visionStatementIcon from '../../assets/images/My Spark Widget Icons/Blue background/5. Vision statement.png'
import valuePropositionIcon from '../../assets/images/My Spark Widget Icons/Blue background/6. Value proposition.png'
import startUpIdeasIcon from '../../assets/images/My Spark Widget Icons/Blue background/7. Startup ideas.png'
import missionStatementIcon from '../../assets/images/My Spark Widget Icons/Blue background/8. Mission statement.png'
import socialPostIcon from '../../assets/images/My Spark Widget Icons/Blue background/9. Social Post.png'
import socialPostCaptionIcon from '../../assets/images/My Spark Widget Icons/Blue background/10. Social post caption.png'
import videoScriptIcon from '../../assets/images/My Spark Widget Icons/Blue background/11. Video script.png'
import imageIcon from '../../assets/images/My Spark Widget Icons/Blue background/12. Image.png'

export function isEmptyObject(obj) {
  return Object.entries(obj).length === 0
}
export function formatAIResponse(text) {
  text = text?.replace(/\n\n/g, '<br/><br/>')
  text = text?.replace(/\n/g, '<br/>')
  return text
}

export const HTMLToString = (html) => {
  let div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export const imageResolutionToPercentage = (imageResolution, page) => {
  let newResolution = {}
  if (imageResolution === '1024x1024') {
    newResolution = {
      width: page === 'generate-page' ? '50%' : '90%',
      height: page === 'generate-page' ? '50%' : '90%'
    }
  } else if (imageResolution === '512x512') {
    newResolution = {
      width: page === 'generate-page' ? '40%' : '80%',
      height: page === 'generate-page' ? '40%' : '80%'
    }
  } else if (imageResolution === '256x256') {
    newResolution = {
      width: page === 'generate-page' ? '30%' : '70%',
      height: page === 'generate-page' ? '30%' : '70%'
    }
  }
  return newResolution
}

export function addDocumentIcons(data) {
  return data?.map((doc) => {
    let documentIcon
    switch (doc.type) {
      case 'article':
        documentIcon = articleIcon
        break
      case 'about-us':
        documentIcon = aboutUsIcon
        break
      case 'faq':
        documentIcon = faqIcon
        break
      case 'startup-names':
        documentIcon = startUpNamesIcon
        break
      case 'vision-statement':
        documentIcon = visionStatementIcon
        break
      case 'startup-ideas':
        documentIcon = startUpIdeasIcon
        break
      case 'value-proposition':
        documentIcon = valuePropositionIcon
        break
      case 'mission-statement':
        documentIcon = missionStatementIcon
        break
      case 'social-post':
        documentIcon = socialPostIcon
        break
      case 'social-post-caption':
        documentIcon = socialPostCaptionIcon
        break
      case 'video-script':
        documentIcon = videoScriptIcon
        break
      case 'image':
        documentIcon = imageIcon
        break
      default:
        console.log('default')
    }
    return {
      ...doc,
      icon: documentIcon
    }
  })
}

export function addDocumentIcon(doc) {
  let documentIcon
  switch (doc?.type) {
    case 'article':
      documentIcon = articleIcon
      break
    case 'about-us':
      documentIcon = aboutUsIcon
      break
    case 'faq':
      documentIcon = faqIcon
      break
    case 'startup-names':
      documentIcon = startUpNamesIcon
      break
    case 'vision-statement':
      documentIcon = visionStatementIcon
      break
    case 'startup-ideas':
      documentIcon = startUpIdeasIcon
      break
    case 'value-proposition':
      documentIcon = valuePropositionIcon
      break
    case 'mission-statement':
      documentIcon = missionStatementIcon
      break
    case 'social-post':
      documentIcon = socialPostIcon
      break
    case 'social-post-caption':
      documentIcon = socialPostCaptionIcon
      break
    case 'video-script':
      documentIcon = videoScriptIcon
      break
    case 'image':
      documentIcon = imageIcon
      break
    default:
      console.log('default')
  }
  return documentIcon
}
