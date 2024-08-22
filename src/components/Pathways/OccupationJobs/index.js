import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import './style.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import MilitaryOccupation from './MilitaryOccupation'
import { useDispatch } from 'react-redux'
import { setBackButton } from '../../../redux/backButtonReducer'

const OccupationJobs = ({ occupationGroup, occupationJobs }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBackButton(true, 'pathways'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  return (
    <>
      {occupationGroup?.name !== 'Military' ? (
        <>
          <div className='occupation-content pb-3'>
            {occupationGroup?.content}
          </div>
          <Table bordered hover size='sm'>
            <thead>
              <tr>
                <th>OCCUPATION</th>
                <th>JOB SUMMARY</th>
                <th>ENTRY LEVEL EDUCATION </th>
                <th>2022 MEDIAN PAY</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {occupationJobs?.map((job) => {
                const match =
                  job.quick_facts[0].text.match(/\$\d+(,\d+)*(\.\d+)?/)
                const salary = match ? match[0] : job.quick_facts[0].text
                const entryLevelEducation = job.quick_facts[1]?.text
                return (
                  <tr key={job.id}>
                    <td className='col-3 fw-bold '>
                      <p
                        onClick={() =>
                          history.push(
                            `/pathways/${occupationGroup.id}/${job.id}/details`
                          )
                        }
                        className='cursor-pointer'
                      >
                        {job?.name}
                      </p>
                    </td>
                    <td className='col-5'>{job?.job_summary}</td>
                    <td className='col-2'>{entryLevelEducation}</td>
                    <td className='col-2'>{salary}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <MilitaryOccupation />
      )}
    </>
  )
}

export default OccupationJobs
