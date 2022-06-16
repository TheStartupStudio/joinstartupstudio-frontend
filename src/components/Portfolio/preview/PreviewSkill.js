import PreviewIndividualSkill from '../../Portfolio/Skills/previewIndividualSkill'
export default function PreviewSkill(props) {
  const style = {
    title: {
      textAlign: 'left',
      font: ' normal normal 600 24px/29px Montserrat',
      letterSpacing: '0px',
      color: '#333D3D'
    }
  }
  return (
    <div className='row gx-0'>
      {props.skills && props.skills != 0 ? (
        <div className='col-12 mt-5'>
          <h3 style={style.title} className='mb-md-3'>
            TOP SKILLS
          </h3>
          {props.skills &&
            props.skills.map((skill, index) => (
              <PreviewIndividualSkill
                key={index}
                skill={skill}
                className='mb-3'
              />
            ))}
        </div>
      ) : null}
    </div>
  )
}
