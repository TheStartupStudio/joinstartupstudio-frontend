const CDN_BASE = 'https://d5tx03iw7t69i.cloudfront.net/Intro-to-the-Studio'

const fileUrl = (filename) => `${CDN_BASE}/${encodeURIComponent(filename)}`

export const WALKTHROUGH_STEPS = [
  {
    id: 1,
    title: 'Welcome to Your Studio',
    purpose: 'A tour of your Studio and where everything lives.',
    duration: '1:40',
    videoUrl: 'https://learntostart-launch-dev.s3.us-east-1.amazonaws.com/Journal/MentorshipJournal/65bf33468902df4637432435f809c3b8-1787733967141.mp4',
    posterUrl: fileUrl('poster-01.png'),
    posterTitleSize: 'default'
  },
  {
    id: 2,
    title: 'Course in Entrepreneurship',
    purpose: 'How the three levels work and why your reflections matter.',
    duration: '1:35',
    videoUrl: "https://learntostart-launch-dev.s3.us-east-1.amazonaws.com/Journal/MentorshipJournal/1fea0c06bedfea8a01993359d4828cd4-1787734308965.mp4",
    posterUrl: fileUrl('poster-02.png'),
    posterTitleSize: 'compact'
  },
  {
    id: 3,
    title: 'Tasks',
    purpose: 'This is where you stop learning about it and start building it.',
    duration: '1:28',
    videoUrl: "https://learntostart-launch-dev.s3.us-east-1.amazonaws.com/Journal/MentorshipJournal/9584ca91b611453eb2b57f5c12285e77-1787734390368.mp4",
    posterUrl: fileUrl('poster-03.png'),
    posterTitleSize: 'default'
  },
  {
    id: 4,
    title: 'Studio Journals',
    purpose: 'Go deeper on the skills that make you Market-Ready.',
    duration: '1:19',
    videoUrl: "https://learntostart-launch-dev.s3.us-east-1.amazonaws.com/Journal/MentorshipJournal/f50af8fb5c1c3e3d651682539c2ffc07-1787734456323.mp4",
    posterUrl: fileUrl('poster-04.png'),
    posterTitleSize: 'default'
  },
  {
    id: 5,
    title: 'Studio Forum',
    purpose: 'The work stops being something you do alone.',
    duration: '1:11',
    videoUrl: "https://learntostart-launch-dev.s3.us-east-1.amazonaws.com/Journal/MentorshipJournal/5c7023057be0647c617ade75308d7635-1787734745531.mp4",
    posterUrl: fileUrl('poster-05.png'),
    posterTitleSize: 'default'
  },
  {
    id: 6,
    title: 'Market-Ready Portfolio',
    purpose:
      'Everything you build comes together in one place you can share.',
    duration: '2:34',
    videoUrl: "https://learntostart-launch-dev.s3.us-east-1.amazonaws.com/Journal/MentorshipJournal/23cce42a768943263c1fcbbbb57cddf3-1787734800354.mp4",
    posterUrl: fileUrl('poster-06.png'),
    posterTitleSize: 'compact'
  }
]

export const WALKTHROUGH_STORAGE_PREFIX = 'intro_studio_walkthrough_watched_'
