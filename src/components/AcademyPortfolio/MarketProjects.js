import PortfolioWrapper from './PortfolioWrapper'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import MarketCard from './MarketCard'
import designQueen from '../../assets/images/academy-icons/Design-queen.png'
import pitchDeck from '../../assets/images/academy-icons/Pitch-deck.png'
import nemoursMarketing from '../../assets/images/academy-icons/Nemours-marketing.png'
import socialDesign from '../../assets/images/academy-icons/SocialMedia-design.png'
import NewProject from './NewProject'
import { useState } from 'react'

function MarketProjects() {
  const [openNew, setOpenNew] = useState(false)
  const array = [
    {
      image: designQueen,
      title: 'Who Am I? Design Queen',
      uploaded: 'December 2025'
    },
    {
      image: pitchDeck,
      title: 'Design Pitch Deck',
      uploaded: 'December 2025'
    },
    {
      image: nemoursMarketing,
      title: 'Day in the Life: Nemours Marketing Intern',
      uploaded: 'December 2025'
    },
    {
      image: socialDesign,
      title: 'Designing for Social Media',
      uploaded: 'December 2025'
    }
  ]

  return (
    <>
      <PortfolioWrapper
        img={courseLogo}
        title={'Market-Ready Projects'}
        setOpenNew={setOpenNew}
      >
        <div
          className='d-grid'
          style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '5rem' }}
        >
          {array.map((item, index) => (
            <MarketCard
              key={index}
              imgSrc={item.image}
              title={item.title}
              uploaded={item.uploaded}
            />
          ))}
        </div>
      </PortfolioWrapper>
      <NewProject isOpen={openNew} setIsOpen={setOpenNew} />
    </>
  )
}

export default MarketProjects
