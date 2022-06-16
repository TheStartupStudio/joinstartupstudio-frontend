const PreviewIndividualSkill = (props) => {
  const style = {
    button: {
      background: ' #FFFFFF 0% 0% no-repeat padding-box',
      border: '1px solid #BBBDBF',
      borderRadius: '6px',
      textAlign: ' center',
      font: 'normal normal 600 12px/16px Montserrat',
      letterSpacing: ' 0.48px',
      color: '#707070'
    }
  }
  return (
    <button className='p-3 me-2 mb-3' style={style.button}>
      {props.skill.name}
    </button>
  )
}

export default PreviewIndividualSkill
