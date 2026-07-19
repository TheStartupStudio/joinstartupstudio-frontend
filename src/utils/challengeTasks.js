export const CHALLENGE_TASKS = [
  {
    key: 'portfolio_updated',
    day: 1,
    title: 'Update your Portfolio',
    description:
      'Complete the "My Details" section of your portfolio. Add at least 1 social media link.',
    cta: 'Go to Portfolio',
    href: '/my-portfolio#top',
    toast: 'Day 1 earned. Your My Details section is set up.'
  },
  {
    key: 'builder_connected',
    day: 2,
    title: 'Connect with a Studio Builder',
    description: "Leave a comment on another Builder's post in the Forum.",
    cta: 'Visit the Forum',
    href: '/startup-forum',
    toast: 'Day 2 earned. You made a connection.'
  },
  {
    key: 'forum_intro_posted',
    day: 3,
    title: 'Introduce yourself',
    description:
      'Post your introduction in the Introductions forum using your value proposition.',
    cta: 'Post Introduction',
    href: '/startup-forum/introductions',
    toast: 'Day 3 earned. Your introduction is up.'
  },
  {
    key: 'iam_video_posted',
    day: 4,
    title: 'Post your I Am Video',
    description:
      'Share your I am Video in the forum in the "ask for feedback" channel.',
    cta: 'Post Your Video',
    href: '/startup-forum/ask-for-feedback',
    toast: 'Day 4 earned. Your I Am Video is live.'
  },
  {
    key: 'invite_sent',
    day: 5,
    title: 'Invite a friend to The Studio',
    description:
      "Enter a friend's name and email and we'll send them an invite to join The Studio.",
    cta: 'Send an Invite',
    href: null,
    opensModal: true,
    toast: 'Day 5 earned. Your invite is on its way.'
  }
]

export const WIDGET_COPY = {
  inProgress: {
    eyebrow: 'Studio Builder Challenge',
    headline: 'Earn up to 5 free days',
    subline: 'Complete 5 tasks in your first 7 days of your trial.',
    footer:
      'Each task earns one free day. Challenge closes 7 days after your trial starts.',
    link: 'Challenge Details'
  },
  complete: {
    eyebrow: 'Challenge complete!',
    headline: 'You earned 5 free days.',
    subline: 'Your trial has been extended. Keep building.',
    footer: null,
    link: 'Challenge Details'
  },
  expired: {
    eyebrow: 'Challenge closed',
    headlineTemplate: (n) => `You earned ${n} of 5 free days.`,
    subline:
      'The 7-day challenge window has ended. The days you earned have been applied to your trial.',
    footer: null,
    link: null
  },
  pillText: (n) => (n === 1 ? '1 day earned' : `${n} days earned`)
}

export const DAY_MODAL_COPY = {
  headline: (day) => `You earned Day ${day}.`,
  subheading: (date) => `Your free trial now ends on ${date}.`,
  body: (remaining) =>
    remaining > 0
      ? `Keep going. You have ${remaining} ${remaining === 1 ? 'task' : 'tasks'} left and ${remaining} free ${remaining === 1 ? 'day' : 'days'} still available.`
      : null,
  cta: 'Continue building'
}

export const COMPLETE_MODAL_COPY = {
  headline: 'You did it.',
  subheading: (date) =>
    `5 tasks. 5 free days. Your trial now runs until ${date}.`,
  body: 'You set up your Studio, showed up in the community, shared your story, and invited someone else in. That is what a Studio Builder looks like.',
  cta: 'Keep building'
}

export const ERROR_COPY = {
  alreadyDone: 'You already completed this one. On to the next.',
  windowExpired:
    'The challenge window has closed. Any days you earned have been applied to your trial.',
  trialInactive:
    'Your trial has already ended. The challenge is no longer available.',
  generic: 'Something did not save. Try again in a moment.'
}

export const BRAND = {
  blue: '#51c7df',
  pink: '#ff3399',
  gradient: 'linear-gradient(45deg, #51c7df, #ff3399)'
}

export const TASK_ICON_KEYS = {
  portfolio_updated: 'folder',
  builder_connected: 'chat',
  forum_intro_posted: 'wave',
  iam_video_posted: 'video',
  invite_sent: 'invite'
}
