export const widgetInputData = {
  article: {
    shownWidgetInputs: [
      {
        title: 'Name',
        value: 'Chemistry',
        description: 'The name of the document.',
        placeholder: '',
        order: 1
      },
      {
        title: 'Title',
        value: 'Modern Chemistry',
        description: 'The title of the article.',
        placeholder: 'The best summer destinations',
        order: 2
      },
      {
        title: 'Keywords',
        value: 'atoms, quantum theory',
        description: 'The keywords to include.',
        placeholder: 'ocean, beach, hotel',
        order: 3
      },
      {
        title: 'Subheadings',
        value: 'Quantum theory, Atoms',
        description: 'The subheadings of the article.',
        placeholder: 'Florida, Los Angeles, San Francisco',
        order: 4
      },
      {
        title: 'Length',
        value: 'long',
        description: 'The length of the result.',
        placeholder: '',
        default: 'Medium',
        isSelectInput: true,
        options: ['Short', 'Medium', 'Long'],
        order: 5
      }
    ],
    hiddenWidgetInputs: [
      {
        title: 'Language',
        value: 'English',
        description: 'The language in which the result is to be returned.',
        placeholder: '',
        default: 'English',
        isSelectInput: true,
        options: ['English'],
        order: 1
      },
      {
        title: 'Creativity',
        value: '1',
        description: 'The creative level of the result.',
        placeholder: '',
        default: 'Original',
        isSelectInput: true,
        options: [
          'Repetitive',
          'Deterministic',
          'Original',
          'Creative',
          'Imaginative'
        ],
        order: 2
      },
      {
        title: 'Variations',
        value: '1',
        description: 'The number of variations of results.',
        placeholder: '',
        default: '1',
        isSelectInput: true,
        options: ['1', '2', '3', '4'],
        order: 3
      }
    ]
  }
}
