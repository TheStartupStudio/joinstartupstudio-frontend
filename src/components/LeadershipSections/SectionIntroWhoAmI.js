import YourInstructor from '../LeadershipJournal/YourInstructor'
import SectionsWrapper from './SectionsWrapper'
import { NotesButton } from '../../components/Notes'


function IntroWhoAmI({ setIsReflection }) {
  setIsReflection(false)
  const paragraphs = [
    {
      id: 1,
      text: 'Who are you as a leader? You might not have the answer to this question yet, and that’s okay, it’s why you are here. In this section of your Leadership Journal, you will reflect on four specific areas that will determine who you are as a leader: values, expertise, experience, and style. Each of these components of leadership identity demand your individual and unique perspective. You can look to mentors and exemplars out in the market to inform each of these, but the emphasis is on inform, not dictate. You must see leadership as part of your identity and therefore your communication of your values, your expertise, your experience, and your style must be said in your authentic voice. When you achieve market-readiness through your certification and prove your value in the market through your portfolio, your leadership identity must be a consistent theme throughout your proof. '
    },
    {
      id: 2,
      text: 'How do you lead yourself? Through the identification and commitment to your leadership values. Through the development of and confidence in your leadership expertise. Through the taking of risks and embracing of failure in your leadership experience. Through the tone and  consistency of your leadership style.'
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
          videoUrl={'https://d5tx03iw7t69i.cloudfront.net/Journal/LeadershipJournal/LJ 2 Section One Who Am I - V2.mov'}
          thumbnailUrl={"https://demo-startupstudio-drive.s3.amazonaws.com/users/1972/02fd00cdd211ff6a9d1cef183f6982b0-1747040727899.jpg"}
          showInstructorInfo = {false}
          customTitle="Who am I?"
        />
      </div>
       <NotesButton from="leadershipJournal"
                    data={{
                      id: 1001062,
                      title: 'Introduction to Who am I?'
                    }}
                    createdFrom={'Introduction to Who am I?'}
                    journalId={1001062} 
              />
      <SectionsWrapper
        title={'Introduction to Who am I?'}
        paragraphs={paragraphs}
      />
    </div>
  )
}

export default IntroWhoAmI
