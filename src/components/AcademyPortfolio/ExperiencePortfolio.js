import olympiaHighSchool from '../../assets/images/academy-icons/olympia-highschool.png'
import experienceIcon from '../../assets/images/academy-icons/svg/experience.svg'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import PortfolioContent from './PortfolioContent'
import PortfolioWrapper from './PortfolioWrapper'
import nemoursHospital from '../../assets/images/academy-icons/nemours-hospital.png'

function ExperiencePortfolio() {
  return (
    <PortfolioWrapper img={experienceIcon} title={'Experience'}>
      <PortfolioContent
        imgSrc={universityFlorida}
        title={'Social Media Manager'}
        institution={'Tri Delta Phi Sorority at UFC'}
        duration={'September 2020 - May 2024'}
        link={'https://instagram.com/tri-delta-phi-fsu'}
        fullText={`Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
      quae ab illo inventore veritatis et quasi architecto beatae vitae
      dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
      sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, 
      qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...`}
      />
      <PortfolioContent
        imgSrc={nemoursHospital}
        title={'Marketing Intern'}
        institution={"Nemours Children's Hospital"}
        duration={'May 2021 - August 2021'}
        link={'https://nemours.org/childrens-healthcare'}
        fullText={`Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
      quae ab illo inventore veritatis et quasi architecto beatae vitae
      dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
      sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, 
      qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...`}
      />
    </PortfolioWrapper>
  )
}

export default ExperiencePortfolio
