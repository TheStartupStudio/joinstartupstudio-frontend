import StoryIcon from '../../assets/images/academy-icons/story.png'
import TeamIcon from '../../assets/images/academy-icons/team.png'
import BuildIcon from '../../assets/images/academy-icons/build.png'
import PivotIcon from '../../assets/images/academy-icons/pivot.png'
import PitchIcon from '../../assets/images/academy-icons/pitch.png'

function CorePillars() {
  const content = [
    {
      image: StoryIcon,
      title: 'Story',
      text: 'Story is your ability to communicate who you are and connect with the stories of others.'
    },
    {
      image: TeamIcon,
      title: 'Team',
      text: 'Team is your ability to experience, learn, and understand the power of effective collaboration and leadership.'
    },
    {
      image: BuildIcon,
      title: 'Build',
      text: 'Build is your ability to follow an idea through its execution.'
    },
    {
      image: PivotIcon,
      title: 'Pivot',
      text: 'Pivot is your ability to recognize when it is time to move directions.'
    },
    {
      image: PitchIcon,
      title: 'Pitch',
      text: 'Pitch is your ability to sell your audience on your value and the value of the outcomes you can produce.'
    }
  ]

  return (
    <section className='mt-5'>
      <h3 className='text-center text-black text-uppercase fs-20 fw-light'>
        The Startup Studio’s
        <br />
        <span className='fs-32 fw-bold'>
          Five Core Pillars of Entrepreneurship
        </span>
      </h3>
      <div
        className='d-grid mt-4 gap-4'
        style={{ gridTemplateColumns: 'repeat(5,1fr)' }}
      >
        {content.map((item) => (
          <div className='d-flex flex-column align-items-center'>
            <img
              src={item.image}
              alt={item.title}
              className='collar-image mb-3'
            />
            <h4 className='fs-23 fw-bold text-black text-uppercase'>
              {item.title}
            </h4>
            <p className='fw-light text-black lh-sm'>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CorePillars
