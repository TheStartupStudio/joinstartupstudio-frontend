import { Button } from 'react-bootstrap'

export const columnsStep1 = [
  {
    Header: 'Name of the Company',
    accessor: 'companyName',
    width: 200
  },
  {
    Header: 'Industry Problem Description',
    accessor: 'problemDescription',
    style: { width: '50px' },
    Cell: ({ value }) => (
      <Button className="bg-transparent text-info border-info">
        CLICK TO VIEW({value})
      </Button>
    )
  },
  {
    Header: 'Industry',
    accessor: 'industry'
  },
  {
    Header: 'Completion Date for Solution',
    accessor: 'completionDate'
  },
  {
    Header: '',
    id: 'submit',
    Cell: () => (
      <button style={{ backgroundColor: '#99cc33', color: 'white' }}>
        SUBMIT
      </button>
    )
  }
]

export const columnsStep2 = [
  {
    Header: 'Name of the Company',
    accessor: 'companyName'
  },
  {
    Header: 'Immersion Description',
    accessor: 'problemDescription',
    Cell: ({ value }) => (
      <Button className="bg-transparent text-info border-info">
        CLICK TO VIEW
      </Button>
    )
  },
  {
    Header: 'Industry',
    accessor: 'industry'
  },
  {
    Header: 'Date of Application',
    accessor: 'dateOfApplication'
  },
  {
    Header: 'Date of Immersion Experience',
    accessor: 'dateOfImmersionExperience'
  },
  {
    Header: '',
    id: 'apply',
    width: 200,
    Cell: () => (
      <button style={{ background: '#99cc33', color: 'white' }}>APPLY</button>
    )
  }
]
export const columnsStep4 = [
  {
    Header: 'Name of the Company',
    accessor: 'companyName'
  },
  {
    Header: 'Employment Description',
    accessor: 'employmentDescription',
    Cell: ({ value }) => (
      <Button className="bg-transparent text-info border-info">
        CLICK TO VIEW
      </Button>
    )
  },
  {
    Header: 'Industry',
    accessor: 'industry'
  },
  {
    Header: 'Date of Application',
    accessor: 'dateOfApplication'
  },
  {
    Header: 'Starting date for Employment',
    accessor: 'dateOfImmersionExperience'
  },
  {
    Header: '',
    id: 'apply',
    Cell: () => (
      <button style={{ background: '#99cc33', color: 'white' }}>APPLY</button>
    )
  }
]
