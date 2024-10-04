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
  order: -1,
  validation: {
    isRequired: true,
    message: 'The company field is required'
  }
}
const description = {
  title: 'Description',
  value: '',
  description: 'The description of the product or service.',
  placeholder: 'Creating content that inspires and entertains',
  order: -1,
  validation: {
    isRequired: true,
    message: 'The description field is required'
  },
  type: 'textarea'
}

const name = {
  title: 'Name',
  value: '',
  description: 'The name of the document.',
  placeholder: '',
  order: -1,
  validation: { isRequired: true, message: 'The name field is required' }
}

const title = {
  title: 'Title',
  value: '',
  description: 'The title of the document.',
  placeholder: 'The best summer destinations',
  order: -1,
  validation: { isRequired: true, message: 'The title field is required' }
}

const keywords = {
  title: 'Keywords',
  value: '',
  description: 'The keywords to include.',
  placeholder: 'ocean, beach, hotel',
  order: -1,
  validation: { isRequired: true, message: 'The keywords field is required' }
}
const subHeadings = {
  title: 'Subheadings',
  value: '',
  description: 'The subheadings of the article.',
  placeholder: 'Florida, Los Angeles, San Francisco',
  order: -1,
  validation: { isRequired: true, message: 'The subheadings field is required' }
}

const product = {
  title: 'Product',
  value: '',
  description: 'The name of the product or service.',
  placeholder: 'Youtube',
  order: -1,
  validation: { isRequired: true, message: 'The product field is required' }
}
const audience = {
  title: 'Audience',
  value: '',
  description: 'The audience of the product or service.',
  placeholder: 'Gamers',
  order: -1,
  validation: { isRequired: true, message: 'The audience field is required' }
}

const domains = {
  title: 'Domains',
  value: '',
  description: 'The domains of the startup.',
  placeholder: 'Web programming, digital art, artificial intelligence',
  order: -1,
  validation: {
    isRequired: true,
    message: 'The domains field is required'
  }
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

const languageOptions = [
  { name: 'Afar', value: 'afar' },
  { name: 'Аҧсуа', value: 'аҧсуа' },
  { name: 'Afrikaans', value: 'afrikaans' },
  { name: 'Akana', value: 'akana' },
  { name: 'አማርኛ', value: 'አማርኛ' },
  { name: 'Aragonés', value: 'aragonés' },
  { name: 'العربية', value: 'العربية' },
  { name: 'অসমীয়া', value: 'অসমীয়া' },
  { name: 'Авар', value: 'авар' },
  { name: 'Aymar', value: 'aymar' },
  { name: 'Azərbaycanca / آذربايجان', value: 'azərbaycanca / آذربايجان' },
  { name: 'Башҡорт', value: 'башҡорт' },
  { name: 'Беларуская', value: 'беларуская' },
  { name: 'Български', value: 'български' },
  { name: 'भोजपुरी', value: 'भोजपुरी' },
  { name: 'Bislama', value: 'bislama' },
  { name: 'Bamanankan', value: 'bamanankan' },
  { name: 'বাংলা', value: 'বাংলা' },
  { name: 'བོད་ཡིག / Bod skad', value: 'བོད་ཡིག / bod skad' },
  { name: 'Brezhoneg', value: 'brezhoneg' },
  { name: 'Bosanski', value: 'bosanski' },
  { name: 'Català', value: 'català' },
  { name: 'Нохчийн', value: 'нохчийн' },
  { name: 'Chamoru', value: 'chamoru' },
  { name: 'Corsu', value: 'corsu' },
  { name: 'Nehiyaw', value: 'nehiyaw' },
  { name: 'Česky', value: 'česky' },
  { name: 'словѣньскъ / slověnĭskŭ', value: 'словѣньскъ / slověnĭskŭ' },
  { name: 'Чăваш', value: 'чăваш' },
  { name: 'Cymraeg', value: 'cymraeg' },
  { name: 'Dansk', value: 'dansk' },
  { name: 'Deutsch', value: 'deutsch' },
  { name: 'ދިވެހިބަސް', value: 'ދިވެހިބަސް' },
  { name: 'ཇོང་ཁ', value: 'ཇོང་ཁ' },
  { name: 'Ɛʋɛ', value: 'ɛʋɛ' },
  { name: 'Ελληνικά', value: 'ελληνικά' },
  { name: 'English', value: 'english' },
  { name: 'Esperanto', value: 'esperanto' },
  { name: 'Español', value: 'español' },
  { name: 'Eesti', value: 'eesti' },
  { name: 'Euskara', value: 'euskara' },
  { name: 'فارسی', value: 'فارسی' },
  { name: 'Fulfulde', value: 'fulfulde' },
  { name: 'Suomi', value: 'suomi' },
  { name: 'Na Vosa Vakaviti', value: 'na vosa vakaviti' },
  { name: 'Føroyskt', value: 'føroyskt' },
  { name: 'Français', value: 'français' },
  { name: 'Frysk', value: 'frysk' },
  { name: 'Gaeilge', value: 'gaeilge' },
  { name: 'Gàidhlig', value: 'gàidhlig' },
  { name: 'Galego', value: 'galego' },
  { name: "Avañe'ẽ", value: "avañe'ẽ" },
  { name: 'ગુજરાતી', value: 'ગુજરાતી' },
  { name: 'Gaelg', value: 'gaelg' },
  { name: 'هَوُسَ', value: 'هَوُسَ' },
  { name: 'עברית', value: 'עברית' },
  { name: 'हिन्दी', value: 'हिन्दी' },
  { name: 'Hiri Motu', value: 'hiri motu' },
  { name: 'Hrvatski', value: 'hrvatski' },
  { name: 'Krèyol ayisyen', value: 'krèyol ayisyen' },
  { name: 'Magyar', value: 'magyar' },
  { name: 'Հայերեն', value: 'հայերեն' },
  { name: 'Otsiherero', value: 'otsiherero' },
  { name: 'Interlingua', value: 'interlingua' },
  { name: 'Bahasa Indonesia', value: 'bahasa indonesia' },
  { name: 'Interlingue', value: 'interlingue' },
  { name: 'Igbo', value: 'igbo' },
  { name: 'ꆇꉙ / 四川彝语', value: 'ꆇꉙ / 四川彝语' },
  { name: 'Iñupiak', value: 'iñupiak' },
  { name: 'Ido', value: 'ido' },
  { name: 'Íslenska', value: 'íslenska' },
  { name: 'Italiano', value: 'italiano' },
  { name: 'ᐃᓄᒃᑎᑐᑦ', value: 'ᐃᓄᒃᑎᑐᑦ' },
  { name: '日本語', value: '日本語' },
  { name: 'Basa Jawa', value: 'basa jawa' },
  { name: 'ქართული', value: 'ქართული' },
  { name: 'KiKongo', value: 'kikongo' },
  { name: 'Gĩkũyũ', value: 'gĩkũyũ' },
  { name: 'Kuanyama', value: 'kuanyama' },
  { name: 'Қазақша', value: 'қазақша' },
  { name: 'Kalaallisut', value: 'kalaallisut' },
  { name: 'ភាសាខ្មែរ', value: 'ភាសាខ្មែរ' },
  { name: 'ಕನ್ನಡ', value: 'ಕನ್ನಡ' },
  { name: '한국어', value: '한국어' },
  { name: 'Kanuri', value: 'kanuri' },
  { name: 'कश्मीरी / كشميري', value: 'कश्मीरी / كشميري' },
  { name: 'Kurdî / كوردی', value: 'kurdî / كوردی' },
  { name: 'Коми', value: 'коми' },
  { name: 'Kernewek', value: 'kernewek' },
  { name: 'Kırgızca / Кыргызча', value: 'кыргызча' },
  { name: 'Latina', value: 'latina' },
  { name: 'Lëtzebuergesch', value: 'lëtzebuergesch' },
  { name: 'Luganda', value: 'luganda' },
  { name: 'Limburgs', value: 'limburgs' },
  { name: 'Lingála', value: 'lingála' },
  { name: 'ລາວ / Pha xa lao', value: 'ລາວ / pha xa lao' },
  { name: 'Lietuvių', value: 'lietuvių' },
  { name: 'Tshiluba', value: 'tshiluba' },
  { name: 'Latviešu', value: 'latviešu' },
  { name: 'Malagasy', value: 'malagasy' },
  { name: 'Kajin Majel / Ebon', value: 'kajin majel / ebon' },
  { name: 'Māori', value: 'māori' },
  { name: 'Македонски', value: 'македонски' },
  { name: 'മലയാളം', value: 'മലയാളം' },
  { name: 'Монгол', value: 'монгол' },
  { name: 'Moldovenească', value: 'moldovenească' },
  { name: 'मराठी', value: 'मराठी' },
  { name: 'Bahasa Melayu', value: 'bahasa melayu' },
  { name: 'bil-Malti', value: 'bil-malti' },
  { name: 'မြန်မာစာ', value: 'မြန်မာစာ' },
  { name: 'Dorerin Naoero', value: 'dorerin naoero' },
  { name: 'Norsk bokmål', value: 'norsk bokmål' },
  { name: 'Sindebele', value: 'sindebele' },
  { name: 'नेपाली', value: 'नेपाली' },
  { name: 'Oshiwambo', value: 'oshiwambo' },
  { name: 'Nederlands', value: 'nederlands' },
  { name: 'Norsk nynorsk', value: 'norsk nynorsk' },
  { name: 'Norsk', value: 'norsk' },
  { name: 'isiNdebele', value: 'isindebele' },
  { name: 'Diné bizaad', value: 'diné bizaad' },
  { name: 'Chi-Chewa', value: 'chi-chewa' },
  { name: 'Occitan', value: 'occitan' },
  { name: 'ᐊᓂᔑᓈᐯᒧᐎᓐ / Anishinaabemowin', value: 'ᐊᓂᔑᓈᐯᒧᐎᓐ / anishinaabemowin' },
  { name: 'Oromoo', value: 'oromoo' },
  { name: 'ଓଡ଼ିଆ', value: 'ଓଡ଼ିଆ' },
  { name: 'Иронау', value: 'иронау' },
  { name: 'ਪੰਜਾਬੀ / पंजाबी / پنجابي', value: 'ਪੰਜਾਬੀ / पंजाबी / پنجابي' },
  { name: 'Pāli / पाऴि', value: 'pāli / पाऴि' },
  { name: 'Polski', value: 'polski' },
  { name: 'پښتو', value: 'پښتو' },
  { name: 'Português', value: 'português' },
  { name: 'Runa Simi', value: 'runa simi' },
  { name: 'Rumantsch', value: 'rumantsch' },
  { name: 'Kirundi', value: 'kirundi' },
  { name: 'Română', value: 'română' },
  { name: 'Русский', value: 'русский' },
  { name: 'Kinyarwandi', value: 'kinyarwandi' },
  { name: 'संस्कृतम्', value: 'संस्कृतम्' },
  { name: 'Sardu', value: 'sardu' },
  { name: 'सिनधि', value: 'सिनधि' },
  { name: 'Sámegiella', value: 'sámegiella' },
  { name: 'Sängö', value: 'sängö' },
  {
    name: 'Srpskohrvatski / Српскохрватски',
    value: 'srpskohrvatski / српскохрватски'
  },
  { name: 'සිංහල', value: 'සිංහල' },
  { name: 'Slovenčina', value: 'slovenčina' },
  { name: 'Slovenščina', value: 'slovenščina' },
  { name: 'Gagana Samoa', value: 'gagana samoa' },
  { name: 'chiShona', value: 'chishona' },
  { name: 'Soomaaliga', value: 'soomaaliga' },
  { name: 'Shqip', value: 'shqip' },
  { name: 'Српски', value: 'српски' },
  { name: 'SiSwati', value: 'siswati' },
  { name: 'Sesotho', value: 'sesotho' },
  { name: 'Basa Sunda', value: 'basa sunda' },
  { name: 'Svenska', value: 'svenska' },
  { name: 'Kiswahili', value: 'kiswahili' },
  { name: 'தமிழ்', value: 'தமிழ்' },
  { name: 'తెలుగు', value: 'తెలుగు' },
  { name: 'Тоҷикӣ', value: 'тоҷикӣ' },
  { name: 'ไทย / Phasa Thai', value: 'ไทย / phasa thai' },
  { name: 'ትግርኛ', value: 'ትግርኛ' },
  { name: 'Туркмен / تركمن', value: 'туркмен / تركمن' },
  { name: 'Tagalog', value: 'tagalog' },
  { name: 'Setswana', value: 'setswana' },
  { name: 'Lea Faka-Tonga', value: 'lea faka-tonga' },
  { name: 'Türkçe', value: 'türkçe' },
  { name: 'Xitsonga', value: 'xitsonga' },
  { name: 'Tatarça', value: 'tatarça' },
  { name: 'Twi', value: 'twi' },
  { name: 'Reo Mā`ohi', value: 'reo mā`ohi' },
  { name: 'Uyƣurqə / ئۇيغۇرچە', value: 'uyƣurqə / ئۇيغۇرچە' },
  { name: 'Українська', value: 'українська' },
  { name: 'اردو', value: 'اردو' },
  { name: 'Ўзбек', value: 'ўзбек' },
  { name: 'Tshivenḓa', value: 'tshivenḓa' },
  { name: 'Tiếng Việt', value: 'tiếng việt' },
  { name: 'Volapük', value: 'volapük' },
  { name: 'Walon', value: 'walon' },
  { name: 'Wollof', value: 'wollof' },
  { name: 'isiXhosa', value: 'isixhosa' },
  { name: 'ייִדיש', value: 'ייִדיש' },
  { name: 'Yorùbá', value: 'yorùbá' },
  { name: 'Cuengh / Tôô / 壮语', value: 'cuengh / tôô / 壮语' },
  { name: '中文', value: 'chinese' },
  { name: 'isiZulu', value: 'isizulu' }
]

const hiddenWidgetInputs = [
  {
    title: 'Language',
    value: 'english',
    description: 'The language in which the result is to be returned.',
    placeholder: '',
    default: 'English',
    isSelectInput: true,
    options: languageOptions,
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
      value: '',
      placeholder: '',
      order: 1
    },
    {
      ...title,
      value: '',
      description: 'The title of the article.',
      order: 2
    },
    {
      ...keywords,
      value: '',
      placeholder: 'ocean, beach, hotel',
      order: 3
    },
    {
      ...subHeadings,
      value: '',
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
      value: '',
      order: 1
    },
    {
      ...product,
      value: '',
      order: 2
    },
    {
      ...audience,
      value: '',
      order: 3
    },
    {
      ...description,
      value: ``,
      order: 4
    },
    { ...tone, order: 5 },
    ...hiddenWidgetInputs
  ],
  faq: [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...product,
      value: '',
      order: 2
    },
    {
      ...description,
      value: '',
      order: 3
    },
    ...hiddenWidgetInputs
  ],
  'startup-names': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...description,
      value: '',
      description: 'The description of the startup.',
      placeholder: 'Web and mobile software development agency',
      order: 2
    },
    {
      ...keywords,
      value: '',
      description: 'The keywords to include.',
      placeholder: 'Web, dev',
      order: 3
    },
    ...hiddenWidgetInputs
  ],
  'vision-statement': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...company,
      value: '',
      order: 2
    },
    {
      ...description,
      value: '',
      description: 'The description of the company.',
      placeholder: 'Learn how to program through our easy to understand course',
      order: 3
    },
    ...hiddenWidgetInputs
  ],
  'value-proposition': [
    {
      ...name,
      value: '',
      placeholder: '',
      order: 1
    },
    {
      ...product,
      value: '',
      order: 2
    },
    {
      ...audience,
      value: '',
      order: 3
    },
    {
      ...description,
      value: ``,
      order: 4
    },
    { ...tone, order: 5 },
    ...hiddenWidgetInputs
  ],
  'startup-ideas': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...domains,
      value: '',
      order: 2
    },
    ...hiddenWidgetInputs
  ],
  'mission-statement': [
    {
      ...name,
      value: '',
      order: 1
    },
    {
      ...company,
      value: '',
      order: 2
    },
    {
      ...description,
      value: '',
      placeholder: 'We strive to be the best when it comes to content creation',
      description: 'The description of the company',
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
      value: '',
      description: 'The name of the image.',
      order: 1
    },
    {
      ...description,
      value: '',
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
