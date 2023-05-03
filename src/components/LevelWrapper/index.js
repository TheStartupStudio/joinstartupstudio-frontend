import {Children} from 'react'

const LevelWrapper = ({children, user}) => {
    return (
        <>
            {Children.toArray(children).filter(child => child.props.level == user.level)}
        </>
    )
}

export default LevelWrapper