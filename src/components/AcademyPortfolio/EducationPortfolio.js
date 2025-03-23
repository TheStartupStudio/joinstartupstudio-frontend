import educationIcon from '../../assets/images/academy-icons/svg/education&ac.svg'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import PortfolioContent from './PortfolioContent'
import PortfolioWrapper from './PortfolioWrapper'
import olympiaHighSchool from '../../assets/images/academy-icons/olympia-highschool.png'

function EducationPortfolio() {
  return (
    <PortfolioWrapper img={educationIcon} title={'Education & Accomplishments'}>
      <PortfolioContent
        imgSrc={universityFlorida}
        title={'Bachelors of Arts in Media & Communication Studies'}
        institution={'University of Central Florida'}
        duration={'September 2020 - Present'}
        link={'https://ucf.edu/media-communication-studies'}
        fullText={`Sed ut perspiciatis unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
      quae ab illo inventore veritatis et quasi architecto beatae vitae
      dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
      sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, 
      qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...`}
      />
      <PortfolioContent
        imgSrc={olympiaHighSchool}
        title={'High School Diploma'}
        institution={'Olympia High School'}
        duration={'August 2016 - May 2020'}
        link={'https://ocps.net/olympiahs'}
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

export default EducationPortfolio
