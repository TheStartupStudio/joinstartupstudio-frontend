import { useMemo } from 'react'
import { Route, useParams } from 'react-router-dom'
// import CertificationStatus from '../certificationStatus'
import { useIamrContext } from '../iamrContext/context'
import LoadingAnimation from '../loadingAnimation'
import SkillJournal from '../skillJournal'
import SkillContent from '../skillContent'
import CertificationStatus from '../certificationStatus'
import SkillUploads from '../skillUploads'

const SkillsRouter = () => {
  const { loading } = useIamrContext()
  const { id, type } = useParams()
  const { findOneSkill } = useIamrContext()

  const skill = useMemo(() => {
    return findOneSkill(id)
  }, [id, loading])

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
            <Route
              exact
              path={`/student-iamr/:studentId/:id/content`}
              component={() => <SkillContent skill={skill} />}
            />
            <Route
              path={`/student-iamr/:studentId/:id/certification-status`}
              component={CertificationStatus}
            />
            <Route
              exact
              path={`/student-iamr/:studentId/:id/journal`}
              component={() => <SkillJournal skill={skill} />}
            />
            <Route
              exact
              path={`/student-iamr/:studentId/:id/uploads/:uploadId?`}
              component={() => <SkillUploads skill={skill} />}
            />
          </>
        )}
      </div>
    )
  }, [skill, type, loading])

  return <>{MemoizedSkillsRouter}</>
}
export default SkillsRouter
