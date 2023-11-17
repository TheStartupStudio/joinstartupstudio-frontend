const tone = {
  title: 'Tone',
  value: 'professional',
  description: 'The tone of result.',
  placeholder: '',
  default: 'professional',
  isSelectInput: true,
  options: [
    { value: 'professional', name: '🤵 Professional' },
    { value: 'childish', name: '😜 Childish' },
    { value: 'luxurious', name: '💎 Luxurious' },
    { value: 'confident', name: '💪 Confident' },
    { value: 'friendly', name: '😊 Friendly' },
    { value: 'exciting', name: '😃 Exciting' },
    { value: 'casual', name: '😎 Casual' },
    { value: 'dramatic', name: '🎭 Dramatic' },
    { value: 'masculine', name: '👨‍💼 Masculine' },
    { value: 'feminine', name: '👩‍💼 Feminine' }
  ],
  order: -1
}

const company = {
  title: 'Company',
  value: '',
  description: 'The name of the company.',
  placeholder: 'Youtube',
  order: -1
}
const description = {
  title: 'Description',
  value: '',
  description: 'The description of the product or service.',
  placeholder: 'Creating content that inspires and entertains',
  order: -1
}

const name = {
  title: 'Name',
  value: '',
  description: 'The name of the document.',
  placeholder: '',
  order: -1
}

const title = {
  title: 'Title',
  value: '',
  description: 'The title of the document.',
  placeholder: 'The best summer destinations',
  order: -1
}

const keywords = {
  title: 'Keywords',
  value: '',
  description: 'The keywords to include.',
  placeholder: 'ocean, beach, hotel',
  order: -1
}
const subHeadings = {
  title: 'Subheadings',
  value: '',
  description: 'The subheadings of the article.',
  placeholder: 'Florida, Los Angeles, San Francisco',
  order: -1
}

const product = {
  title: 'Product',
  value: '',
  description: 'The name of the product or service.',
  placeholder: 'Youtube',
  order: -1
}
const audience = {
  title: 'Audience',
  value: '',
  description: 'The audience of the product or service.',
  placeholder: 'Gamers',
  order: -1
}

const domains = {
  title: 'Domains',
  value: '',
  description: 'The domains of the startup.',
  placeholder: 'Web programming, digital art, artificial intelligence',
  order: -1
}
const length = {
  title: 'Length',
  value: 'medium',
  description: 'The length of the result.',
  placeholder: '',
  default: 'Medium',
  isSelectInput: true,
  options: [
    { value: 'short', name: 'Short' },
    { value: 'medium', name: 'Medium' },
    { value: 'long', name: 'Long' }
  ],
  order: -1
}

const style = {
  title: 'Style',
  value: 'None',
  description: 'The style of the image.',
  placeholder: '',
  default: 'None',
  isSelectInput: true,
  options: [
    { value: '', name: 'None' },
    { value: '3d_render', name: '3D render' },
    { value: 'abstract', name: 'Abstract' },
    { value: 'anime', name: 'Anime' },
    { value: 'art_deco', name: 'Art deco' },
    { value: 'cartoon', name: 'Cartoon' },
    { value: 'digital_art', name: 'Digital art' },
    { value: 'illustration', name: 'Illustration' },
    { value: 'origami', name: 'Origami' },
    { value: 'pixel_art', name: 'Pixel art' },
    { value: 'photography', name: 'Photography' },
    { value: 'pop_art', name: 'Pop art' },
    { value: 'retro', name: 'Retro' },
    { value: 'sketch', name: 'Sketch' },
    { value: 'vaporwave', name: 'Vaporwave' }
  ],
  order: -1
}

const medium = {
  title: 'Medium',
  value: 'None',
  description: 'The medium of the image.',
  placeholder: '',
  default: 'None',
  isSelectInput: true,
  options: [
    { value: '', name: 'None' },
    { value: 'acrylic', name: 'Acrylic' },
    { value: 'canvas', name: 'Canvas' },
    { value: 'chalk', name: 'Chalk' },
    { value: 'charcoal', name: 'Charcoal' },
    { value: 'crayon', name: 'Crayon' },
    { value: 'glass', name: 'Glass' },
    { value: 'ink', name: 'Ink' },
    { value: 'pastel', name: 'Pastel' },
    { value: 'pencil', name: 'Pencil' },
    { value: 'spray_paint', name: 'Spray paint' },
    { value: 'watercolor', name: 'Watercolor' }
  ],
  order: -1
}

const filter = {
  title: 'Filter',
  value: 'None',
  description: 'The filter of the image.',
  placeholder: '',
  default: 'None',
  isSelectInput: true,
  options: [
    { value: '', name: 'None' },
    { value: 'grayscale', name: 'Black and white' },
    { value: 'sepia', name: 'Sepia' },
    { value: 'invert', name: 'Invert' }
  ],
  order: -1
}

const resolution = {
  title: 'Resolution',
  value: '512x512',
  description: 'The resolution of the image.',
  placeholder: '',
  default: 'None',
  isSelectInput: true,
  options: [
    { value: '256x256', name: '256×256' },
    { value: '512x512', name: '512×512' },
    { value: '1024x1024', name: '1024×1024' }
  ],
  order: -1
}

const hiddenWidgetInputs = [
  {
    title: 'Language',
    value: 'english',
    description: 'The language in which the result is to be returned.',
    placeholder: '',
    default: 'English',
    isSelectInput: true,
    options: [{ value: 'english', name: 'English' }],
    order: 1,
    isHidden: true
  },
  {
    title: 'Creativity',
    value: 0.5,
    description: 'The creative level of the result.',
    placeholder: '',
    default: 'Original',
    isSelectInput: true,
    options: [
      {
        value: '0',
        name: 'Repetitive'
      },
      {
        value: '0.25',
        name: 'Deterministic'
      },
      {
        value: '0.5',
        name: 'Original'
      },
      {
        value: '0.75',
        name: 'Creative'
      },
      {
        value: '1',
        name: 'Imaginative'
      }
    ],
    order: 2,
    isHidden: true
  },
  {
    title: 'Variations',
    value: '1',
    description: 'The number of variations of results.',
    placeholder: '',
    default: '1',
    isSelectInput: true,
    options: [
      {
        value: '1',
        name: '1'
      },
      {
        value: '2',
        name: '2'
      },
      {
        value: '3',
        name: '3'
      },
      {
        value: '4',
        name: '4'
      }
    ],
    order: 3,
    isHidden: true
  }
]

const filterFields = (inputs, filter) => {
  return inputs.filter((input) => !filter.includes(input.title))
}

export const widgetInputData = {
  article: [
    {
      ...name,
      value: 'Chemistry',
      placeholder: '',
      order: 1
    },
    {
      ...title,
      value: 'Modern Chemistry',
      description: 'The title of the article.',
      order: 2
    },
    {
      ...keywords,
      value: 'atoms, quantum theory',
      placeholder: 'ocean, beach, hotel',
      order: 3
    },
    {
      ...subHeadings,
      value: 'Quantum theory, Atoms',
      description: 'The subheadings of the article.',
      placeholder: 'Florida, Los Angeles, San Francisco',
      order: 4
    },
    {
      ...length,
      order: 5
    },
    ...hiddenWidgetInputs
  ],

  'about-us': [
    {
      ...name,
      title: 'Name',
      value: 'Fantasy Action Game',
      order: 1
    },
    {
      ...product,
      value: 'Video game',
      order: 2
    },
    {
      ...audience,
      value: 'Adult gamers',
      order: 3
    },
    {
      ...description,
      value: `Zombie game`,
      order: 4
    },
    { ...tone, order: 5 },
    ...hiddenWidgetInputs
  ],
  faq: [
    {
      ...name,
      value: 'FAQ for TechSolutions Inc.',
      order: 1
    },
    {
      ...product,
      value: 'TechSolutions Inc. Services',
      order: 2
    },
    {
      ...description,
      value:
        'Answers to common questions about our IT and tech support services.',
      order: 3
    },
    ...hiddenWidgetInputs
  ],
  'startup-names': [
    {
      ...name,
      value: 'Guide to Choosing Startup Names',
      order: 1
    },
    {
      ...description,
      value:
        'A comprehensive guide on how to select the perfect name for your startup.',
      description: 'The description of the startup.',
      placeholder: 'Web and mobile software development agency',
      order: 2
    },
    {
      ...keywords,
      value: 'naming, startup, brand, business',
      description: 'The keywords to include.',
      placeholder: 'Web, dev',
      order: 3
    },
    ...hiddenWidgetInputs
  ],
  'vision-statement': [
    {
      ...name,
      value: 'Vision Statement for Youtube',
      order: 1
    },
    {
      ...company,
      value: 'Youtube',
      order: 2
    },
    {
      ...description,
      value: 'Empowering creators to share their content with the world.',
      description: 'Learn how to program through our easy to understand course',
      placeholder: 'The description of the company.',
      order: 3
    },
    ...hiddenWidgetInputs
  ],
  'value-proposition': [
    {
      ...name,
      value: 'Technology',
      placeholder: '',
      order: 1
    },
    {
      ...product,
      value: 'TechSolutions Inc. Services',
      order: 2
    },
    {
      ...audience,
      value: 'Small and Medium-Sized Businesses',
      order: 3
    },
    {
      ...description,
      value: `Providing comprehensive IT solutions for enhancing business efficiency and growth.`,
      order: 4
    },
    { ...tone, order: 5 },
    ...hiddenWidgetInputs
  ],
  'startup-ideas': [
    {
      ...name,
      value: '.Net 8',
      order: 1
    },
    {
      ...domains,
      value: 'Web programming',
      order: 2
    },
    ...hiddenWidgetInputs
  ],
  'mission-statement': [
    {
      ...name,
      value: 'Mission Statement for ArditTech',
      order: 1
    },
    {
      ...company,
      value: 'ArditTech',
      order: 2
    },
    {
      ...description,
      value: 'We strive to be the best when it comes to content creation.',
      placeholder: 'We strive to be the best when it comes to content creation',
      description: 'We strive to be the best when it comes to content creation',
      order: 3
    },
    { ...tone, order: 4 },
    ...hiddenWidgetInputs
  ],
  'social-post': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...description,
      value: '',
      description: 'The description of the social post.',
      order: 2
    },
    { ...tone, order: 3 },
    ...hiddenWidgetInputs
  ],
  'social-post-caption': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...description,
      value: '',
      description: 'The description of the social post.',
      order: 2
    },
    { ...tone, order: 3 },
    ...hiddenWidgetInputs
  ],
  'video-script': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...description,
      value: '',
      description: 'The description of the video.',
      placeholder: 'Learn how to become a programmer in 5 easy steps',
      order: 2
    },
    { ...tone, order: 3 },
    ...hiddenWidgetInputs
  ],
  image: [
    {
      ...name,
      value: 'Old Items',
      description: 'The name of the image.',
      order: 1
    },
    {
      ...description,
      value: 'Old houses in the middle of dessert, outside parked car',
      description: 'The description of the image.',
      placeholder: 'Blue butterfly',
      order: 2
    },
    { ...style, order: 3 },
    { ...medium, order: 4 },
    { ...filter, order: 5 },
    { ...resolution, order: 6 },
    ...filterFields(hiddenWidgetInputs, ['Creativity', 'Language'])
  ]
}
