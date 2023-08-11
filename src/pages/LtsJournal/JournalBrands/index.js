import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import { NewJournalBrandModal } from '../../../components/Modals/JournalBrands/NewJournalBrandModal'
import { useState } from 'react'

const JournalBrands = (props) => {
    const [showNewJournalModal, setShowNewJournalModal] = useState(false)

    return (
        <div className="journal_brands--wrapper">
            <div className="row">
                {props.brands.map(brand => (
                    <div className="col-12 col-sm-6 col-md-4">
                        <div className="brand__item">
                            <img className="journal__image" src={brand.image} alt="" />
                            <div className="brand__box" dangerouslySetInnerHTML={{
                            __html: `<strong>TYPE OF SHOT:</strong> ${brand.type}`
                            }}></div>
                            <div className="brand__box" dangerouslySetInnerHTML={{
                            __html: `<strong>ACTION:</strong> ${brand.action}`
                            }}></div>
                            <div className="brand__box" dangerouslySetInnerHTML={{
                            __html: `<strong>NARRATION:</strong> ${brand.narration}`
                            }}></div>
                            <div className="brand__box" dangerouslySetInnerHTML={{
                            __html: `<strong>MUSIC:</strong> ${brand.music}`
                            }}></div>
                        </div>
                    </div>
                ))}
                <div className="col-12">
                    <a className='add-new-brand' onClick={(e) => setShowNewJournalModal(true)}>
                      <FontAwesomeIcon icon={faPlus} />
                      Add another full section of Image and the boxes below it
                    </a>
                    <NewJournalBrandModal onHide={() => {
                        props.loadData()
                        setShowNewJournalModal(false)
                    }} show={showNewJournalModal} journalId={props.journalId} />
                </div>
            </div>
        </div>
    )
}

export default JournalBrands