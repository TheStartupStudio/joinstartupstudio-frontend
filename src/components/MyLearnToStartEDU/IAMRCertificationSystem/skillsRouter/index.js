import { useEffect, useMemo } from 'react'
import { Route, useParams } from 'react-router-dom'
import CertificationStatus from '../certificationStatus'
import { useIamrContext } from '../iamrContext/context'
import IAMRWelcomePage from '../iamrWelcome'
import SkillContent from '../skillContent'
import SkillFeedbacks from '../skillFeedbacks'
import SkillInstructions from '../skillInstructions'
import SkillJournal from '../skillJournal'
import SkillUploads from '../skillUploads'
import { useState } from 'react'
import axiosInstance from '../../../../utils/AxiosInstance'
import LoadingAnimation from '../../../../ui/loadingAnimation'

const SkillsRouter = ({ groupingStrings }) => {
  const { loading } = useIamrContext()
  const { id, type } = useParams()
  const [skill, setSkill] = useState()

  useEffect(() => {
    axiosInstance.get(`/iamr/skills/test/${id}`).then(({ data }) => {
      setSkill(data)
    })
  }, [id])

  // const skill = useEffect(() => {
  //   return findOneSkill(id)
  // }, [id, loading])

  const MemoizedSkillsRouter = useMemo(() => {
    return (
      <div className='py-4'>
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : !skill && type && type !== 'certification-status' ? (
          <div className='py-5'>
            <p className='page-content-title text-center my-5 fw-bold'>
              Skill not found!
            </p>
          </div>
        ) : (
          <>
            <Route exact path={'/iamr'} component={IAMRWelcomePage} />
            <Route
              exact
              path={`/iamr/:certificationType/:id/content`}
              component={() => (
                <SkillContent skill={skill} groupingStrings={groupingStrings} />
              )}
            />
            <Route
              path={`/iamr/:certificationType/:id/certification-status`}
              component={CertificationStatus}
            />
            <Route
              exact
              path={`/iamr/:certificationType/:id/instructions/:ticketId?`}
              component={() => (
                <SkillInstructions
                  skill={skill}
                  groupingStrings={groupingStrings}
                />
              )}
            />
            <Route
              exact
              path={`/iamr/:certificationType/:id/journal`}
              component={() => <SkillJournal skill={skill} />}
            />
            <Route
              exact
              path={`/iamr/:certificationType/:id/uploads/:uploadId?`}
              component={() => <SkillUploads skill={skill} />}
            />
            <Route
              exact
              path={`/iamr/:certificationType/:id/feedback/:ticketId?`}
              component={() => <SkillFeedbacks skill={skill} />}
            />
          </>
        )}
      </div>
    )
  }, [skill, type, loading, groupingStrings])

  return <>{MemoizedSkillsRouter}</>
}
export default SkillsRouter
