import React, {useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../auth/UserContext'

const CharacterCard = ({name, id}) => {
    const navigate = useNavigate()
    const {setCharacterId} = useContext(UserContext)

    async function handleClick(evt) {
        evt.preventDefault()
        setCharacterId(id)
        navigate(`/characters/${name}`)
    }

    return (
        <Link className={'card'} onClick={handleClick}>
        <div className='itemCard'>
            <p>
            <b>{name}</b> <br/>
            </p>
        </div>
        </Link>
    )
}

export default CharacterCard