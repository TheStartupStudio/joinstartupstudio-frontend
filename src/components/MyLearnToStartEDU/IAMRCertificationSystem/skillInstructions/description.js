const Description = ({ skill }) => {
  return (
    <div className='page-content-text'>
      <p> {skill.description} </p>
      <p className='mb-1'>
        In order to earn proficiency in the skill of structured problem-solving,
        you must prove <strong> at least three </strong> of the following
        abilities:
      </p>
      <ul>
        {skill.SkillTags.map((tag) => (
          <li>{tag.name}</li>
        ))}
      </ul>
      <p>
        On the Student Uploads page, you can upload as many pieces of evidence
        as you like to prove <strong>at least three</strong> of these abilities.
        You can tag one piece of evidence with more than one ability. For
        example, if you upload a video, you can tag it with &ldquo;Demonstrate
        efficient use of time&rdquo; only, or you could tag it with
        &ldquo;Demonstrate efficient use of time&rdquo; and &ldquo;Develop
        knowledge and skills according to a timeline of steps&rdquo; or more
        tags.
      </p>
      <p>
        You will input a title for your upload, and this is the title your
        instructor will see and use to differentiate between the different
        pieces of evidence you upload.&nbsp;
      </p>
      <p>
        You will choose the type of file you are uploading from the title
        drop-down menu.
      </p>
      <p>
        You will add a shareable link to the file you are uploading, so make
        sure that your instructor is able to view the file when they click on
        the link.
      </p>
      <p>
        You will add an explanation for your upload. You must explain how your
        evidence demonstrates the specific time management tags you chose. This
        is your opportunity to convince your instructor that you are proficient
        in this skill.&nbsp;
      </p>
      <p>
        You can choose to save this upload if you are not ready to submit to
        your instructor but want to save your progress. When you are ready, you
        can click to submit for certification. If your instructor agrees that
        you have proven proficiency for the skill of time management in{' '}
        <strong>at least three</strong> ways, they will mark this skill as
        Proficient. If your instructor does not agree that you have proven
        proficiency, they will mark this skill as Developing and provide you
        feedback on the Feedback page. You can view and respond to your
        instructor&rsquo;s feedback on this page and use it to work towards
        proving proficiency.
      </p>
      <p>
        If you have any questions about these instructions or the skill of time
        management, you can ask your instructor for clarification in the
        Questions section below.
      </p>
    </div>
  )
}

export default Description
