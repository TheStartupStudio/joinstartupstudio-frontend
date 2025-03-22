import YourInstructor from '../LeadershipJournal/YourInstructor'
import SectionsWrapper from './SectionsWrapper'

function SectionTwo({ setIsReflection }) {
  setIsReflection(false)
  const paragraphs = [
    {
      id: 1,
      text: 'What can you do as a leader? Now that you have a better sense of who you are as a leader, you can focus on executing as one. In this section of your Leadership Journal, you will reflect on four specific areas that will determine what you can do as a leader: teamwork, initiative, methodology, and self-assessment. Each of these components of leadership execution must be supported by your leadership identity established in the first section of this journal. You can claim an identity as a leader, but you must also be able to claim real action within that identity to have credibility. It follows the old adage: actions speak louder than words. Make sure your actions match the way you speak about yourself as a leader. Again, you should reach out to mentors as you reflect on your ability to execute as a leader, but make sure you are receiving guidance and not looking for answers. You must be in charge of the answers.'
    },
    {
      id: 2,
      text: 'How do you execute as a leader? By building relationships that work collaboratively founded in an alignment of values. By taking the initiative to start a project instead of waiting on the initiative of others. By establishing a methodology through which you solve problems consistently. By self-assessing your quality of leadership execution and leaning into the data that comes from that type of transparency.'
    },
    {
      id: 3,
      text: 'Reflect on the breakdown of each of these leadership components, then take the time to start your journey of identifying and expressing each of them in the context of the leader version of you.'
    }
  ]

  return (
    <div className='leadership-layout d-grid gap-5'>
      <div className='w-100'>
        <YourInstructor
          instructorName={'DR. Leslie Williams'}
          profilePic={
            'https://s3-alpha-sig.figma.com/img/5281/edbe/057c844eb974d929552c412c8956de9c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jtzM83EbGZBWpKQXVfDBL6Z4e7mbF7eog9obL16NgkFy1KNN7Mk4V9DPFN6498GnwRXbTm1FDWSUv4oGbOZIjXHxhu6ua0xXkv7J8Hl85kQmXVPbAqJuPGmjSsQr2dAmgSuVMlO1xcUV5BRmAvBmEnqJwKAt0~xEmAj4uyfHwRLuzsxidRb4HiVSBLXR5GkjOy1U2UGM4ycTtL3IAAFjlgRhYJ1qAE06tnmkIUr6p5OkRv0djxrDClPbTaLXaBTsrlclw6vo~ApVYvcJl63UzYD4fpHA6mmi5odfvnmzT1obUqtExKlr6fXjWsthlFRRJucaEfNfEqHg0GXoHnaOpQ__'
          }
          userProffesion={
            'Group Head of Social Impact and EDIB at Nord Anglia Education'
          }
        />
      </div>
      <SectionsWrapper
        title={'Introduction to What can I do?'}
        paragraphs={paragraphs}
      />
    </div>
  )
}

export default SectionTwo
