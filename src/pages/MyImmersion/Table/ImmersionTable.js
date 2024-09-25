import React, { useMemo, useState } from 'react'
import { useTable, useResizeColumns } from 'react-table'
import '../style.css'
import ProblemModal from '../Modals/ProblemModal'
import { Button } from 'react-bootstrap'
import SubmitIndustryProblemModal from '../Modals/SubmitIndustryProblemModal'
import SubmitExperienceModal from '../Modals/SubmitExperienceModal'
import { formatDateString } from '../../../utils/helpers'
import AddImmersionModal from '../../../components/admin/MyImmersion/AddImmersionModal'

const ImmersionTable = React.memo(({ data, step, immersions }) => {
  const [problemModal, setProblemModal] = useState(false)
  const [industryProblemModal, setIndustryProblemModal] = useState(false)
  const [experienceModal, setExperienceModal] = useState(false)
  const [clickedImmersion, setClickedImmersion] = useState(null)

  const [selectedImmersion, setSelectedImmersion] = useState(null)

  const tableData = React.useMemo(() => {
    if (!data) return []

    return data?.map((item) => {
      const commonData = {
        problemID: item.id,
        companyDescription: item.company_description,
        companyName: item.company_name,
        problemDescription: item.description,
        industryProblem: item.industry_problem,
        industry: item.industry,
        status: item.status,

        researchGuidance: item.research_guidance,

        completionDate: item.completion_date,
        dateOfApplication: item.dateOfApplication,
        dateOfImmersionExperience: item.dateOfImmersionExperience
      }
      return commonData
    })
  }, [data, step])

  const columnsStep1 = useMemo(
    () => [
      {
        Header: 'Name of the Company',
        accessor: 'companyName',
        width: 200,
        disableResizing: true
      },
      {
        Header: 'Industry Problem Description',
        accessor: 'problemDescription',
        Cell: ({ cell }) => (
          <Button
            className='bg-transparent text-info border-info'
            onClick={() => {
              const immersionData = cell.row.original
              setClickedImmersion(immersionData) // Set the entire immersion object
              setProblemModal(true)
            }}
          >
            CLICK TO VIEW
          </Button>
        )
      },
      {
        Header: 'Industry',
        accessor: 'industry',
        disableResizing: true
      },
      {
        Header: 'Completion Date for Solution',
        accessor: 'completionDate',
        disableResizing: true,
        Cell: ({ value }) => (
          <div className='text-center'>
            {value ? formatDateString(value) : 'N/A'}
          </div>
        )
      },
      {
        Header: '',
        id: 'submit',
        disableResizing: true,
        Cell: ({ cell }) => (
          <button
            className='submit-btn'
            style={{ backgroundColor: '#99cc33', color: 'white' }}
            onClick={() => {
              const immersionData = cell.row.original
              setClickedImmersion(immersionData) // Set the entire immersion object
              setIndustryProblemModal(true)
            }}
          >
            SUBMIT
          </button>
        )
      }
    ],
    []
  )

  const columnsStep2 = useMemo(
    () => [
      {
        Header: 'Name of the Company',
        accessor: 'companyName'
      },
      {
        Header: 'Immersion Description',
        accessor: 'problemDescription',
        Cell: ({ cell }) => (
          <Button
            className='bg-transparent text-info border-info'
            onClick={() => {
              const immersionData = cell.row.original
              setClickedImmersion(immersionData) // Set the entire immersion object
              setProblemModal(true)
            }}
          >
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
        accessor: 'dateOfApplication',
        Cell: ({ value }) => (
          <div className='text-center'>
            {value ? formatDateString(value) : 'N/A'}
          </div>
        )
      },
      {
        Header: 'Date of Immersion Experience',
        accessor: 'dateOfImmersionExperience',
        Cell: ({ value }) => (
          <div className='text-center'>
            {value ? formatDateString(value) : 'N/A'}
          </div>
        )
      },
      {
        Header: '',
        id: 'apply',
        width: 200,
        Cell: ({ cell }) => (
          <button
            className='submit-btn'
            style={{ backgroundColor: '#99cc33', color: 'white' }}
            onClick={() => {
              const immersionData = cell.row.original
              setClickedImmersion(immersionData) // Set the entire immersion object
              setExperienceModal(true)
            }}
          >
            {cell.row.original.submitted ? 'APPLIED' : 'APPLY'}
          </button>
        )
      }
    ],
    []
  )

  const columns = React.useMemo(() => {
    return step === 'step-1' ? columnsStep1 : columnsStep2
  }, [step, columnsStep1, columnsStep2])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData }, useResizeColumns)

  return (
    <>
      <table {...getTableProps()} className='immersion-table'>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows?.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {problemModal && clickedImmersion && (
        <AddImmersionModal
          viewExprience={clickedImmersion}
          justView={true}
          // show={problemModal}
          // immersion={clickedImmersion} // Pass the entire immersion object
          onClose={() => setProblemModal(false)}
        />
      )}
      {experienceModal && clickedImmersion && (
        <SubmitExperienceModal
          show={experienceModal}
          immersion={clickedImmersion} // Pass the entire immersion object
          onHide={() => setExperienceModal(false)}
          mode='add'
        />
      )}
      {industryProblemModal && clickedImmersion && (
        <SubmitIndustryProblemModal
          show={industryProblemModal}
          immersion={clickedImmersion} // Pass the entire immersion object
          onHide={() => setIndustryProblemModal(false)}
          mode='add'
        />
      )}
    </>
  )
})

export default ImmersionTable
