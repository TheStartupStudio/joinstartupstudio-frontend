import YourInstructor from '../LeadershipJournal/YourInstructor'
import SectionsWrapper from './SectionsWrapper'
import { NotesButton } from '../../components/Notes'


function SectionThree({ setIsReflection }) {
  setIsReflection(false)
  const paragraphs = [
    {
      id: 1,
      text: 'How do you prove yourself as a leader? It’s taking your ability to execute as a leader and turning your actions into outcomes through which you can communicate your value. In this section of your Leadership Journal, you will reflect on four specific areas that will determine how you can prove yourself as a leader: outcomes, feedback, iteration, and vision. Each of these components of leadership proof must be supported by your leadership identity established in the first section of this journal and your leadership execution in the second section of your journal. You are proving who you are and what you can do as a leader. You are learning how to communicate your identity and abilities as a leader. You are staking claims in the market as to the type of leadership and experience as a leader on which others can depend. As you seek out mentorship, remember that everyone has their own unique path, so be inspired and informed by others, but determine your own path towards leadership.'
    },
    {
      id: 2,
      text: 'How do you prove yourself as a leader? By putting solutions in the market that stand as repeatable outcomes that you can create. By actively seeking out and listening to feedback from your team and markets so you lead from an informed position. By embracing the process of iteration and applying feedback to increase the value of the outcomes on which you want others to depend. By envisioning the long-term reach and evolution of the solutions you create and leading others to see that vision and execute on it.'
    },
    {
      id: 3,
      text: 'Reflect on the breakdown of each of these leadership components, then take the time to start your journey of identifying and expressing each of them in the context of the leader version of you.'
    }
  ]

  return (
    <div className='leadership-layout d-grid gap-5 grid-col-1-mob'>
      <div className='w-100'>
        <YourInstructor
          instructorName={'DR. Leslie Williams'}
          profilePic={
            'https://s3-alpha-sig.figma.com/img/5281/edbe/057c844eb974d929552c412c8956de9c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jtzM83EbGZBWpKQXVfDBL6Z4e7mbF7eog9obL16NgkFy1KNN7Mk4V9DPFN6498GnwRXbTm1FDWSUv4oGbOZIjXHxhu6ua0xXkv7J8Hl85kQmXVPbAqJuPGmjSsQr2dAmgSuVMlO1xcUV5BRmAvBmEnqJwKAt0~xEmAj4uyfHwRLuzsxidRb4HiVSBLXR5GkjOy1U2UGM4ycTtL3IAAFjlgRhYJ1qAE06tnmkIUr6p5OkRv0djxrDClPbTaLXaBTsrlclw6vo~ApVYvcJl63UzYD4fpHA6mmi5odfvnmzT1obUqtExKlr6fXjWsthlFRRJucaEfNfEqHg0GXoHnaOpQ__'
          }
          userProffesion={
            'Group Head of Social Impact and EDIB at Nord Anglia Education'
          }
          videoUrl={'https://d5tx03iw7t69i.cloudfront.net/Journal/LeadershipJournal/LJ 12 Section Three How Can I Prove It - V2.mov'}
          thumbnailUrl={'https://d5tx03iw7t69i.cloudfront.net/Journal/LeadershipJournal/Dr.Williams1.png'}
          showInstructorInfo = {false}
          customTitle="How do I prove it?"
        />
      </div>
      <NotesButton from="leadershipJournal"
                          data={{
                            id: 1001064,
                            title: 'Introduction to How do I prove it?'
                          }}
                          createdFrom={'Introduction to How do I prove it?'}
                          journalId={1001064} 
                    />
      <SectionsWrapper
        title={'Introduction to How do I prove it?'}
        paragraphs={paragraphs}
      />
    </div>
  )
}

export default SectionThree
