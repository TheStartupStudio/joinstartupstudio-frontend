import React, { useMemo, useState } from 'react'
import { useTable, useResizeColumns } from 'react-table'
import '../style.css'
import ProblemModal from '../Modals/ProblemModal'
import { Button } from 'react-bootstrap'
import SubmitIndustryProblemModal from '../Modals/SubmitIndustryProblemModal'
import SubmitExperienceModal from '../Modals/SubmitExperienceModal'
import { formatDateString } from '../../../utils/helpers'

const ImmersionTable = React.memo(({ data, step }) => {
  const [problemModal, setProblemModal] = useState(false)
  const [industryProblemModal, setIndustryProblemModal] = useState(false)
  const [experienceModal, setExperienceModal] = useState(false)
  const [currentProblemDescription, setCurrentProblemDescription] = useState('')
  const [currentCompanyName, setCurrentCompanyName] = useState('')
  const [problemId, setProblemId] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [problemIsSubmitted, setProblemIsSubmitted] = useState(false)

  const tableData = React.useMemo(() => {
    if (!data) return []
    return data?.map((item) => {
      const commonData = {
        problemID: item.id,
        companyID: item.company_id,
        companyName: item.company,
        problemDescription: item.description,
        industry: item.industry,
        submitted: item.submitted
      }

      return step === 'step-1'
        ? {
            ...commonData,
            completionDate: item.completion_date
          }
        : {
            ...commonData,
            dateOfApplication: item.dateOfApplication,
            dateOfImmersionExperience: item.dateOfImmersionExperience
          }
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
              const { companyName, problemDescription } = cell.row.original

              setCurrentCompanyName(companyName)
              setCurrentProblemDescription(problemDescription)
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
              const { companyName, problemID, companyID, submitted } =
                cell.row.original
              setProblemId(problemID)
              setCompanyId(companyID)
              setCurrentCompanyName(companyName)
              setIndustryProblemModal(true)
              setProblemIsSubmitted(submitted)
            }}
            // disabled={cell.row.original.submitted}
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
              const { companyName, problemDescription } = cell.row.original

              setCurrentCompanyName(companyName)
              setCurrentProblemDescription(problemDescription)
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
              const { companyName, problemID, companyID } = cell.row.original
              setProblemId(problemID)
              setCompanyId(companyID)
              setCurrentCompanyName(companyName)
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
      {problemModal && (
        <ProblemModal
          show={problemModal}
          currentCompanyName={currentCompanyName}
          problemDescription={currentProblemDescription}
          onHide={() => setProblemModal(false)}
        />
      )}
      {experienceModal && (
        <SubmitExperienceModal
          show={experienceModal}
          currentCompanyName={currentCompanyName}
          problemDescription={currentProblemDescription}
          onHide={() => setExperienceModal(false)}
          mode='add'
        />
      )}
      {industryProblemModal && (
        <SubmitIndustryProblemModal
          show={industryProblemModal}
          currentCompanyName={currentCompanyName}
          onHide={() => setIndustryProblemModal(false)}
          problemID={problemId}
          companyID={companyId}
          problemIsSubmitted={problemIsSubmitted}
          mode='add'
        />
      )}
    </>
  )
})

export default ImmersionTable
