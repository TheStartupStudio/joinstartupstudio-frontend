import { EducationCertifications } from '../../../pages/PortfolioNew/educationAndCertification/certification/EducationCertifications'

const Licenses_Certification_Preview = (props) => {
  return (
    <>
      <EducationCertifications
        user={props.certificates}
        from_page={props.from_page}
      />
    </>
  )
}
export default Licenses_Certification_Preview
