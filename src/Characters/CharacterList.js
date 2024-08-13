import React, {useContext, useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import UserContext from '../auth/UserContext'
import Supabase from '../api-homebrew/Supabase'
import CharacterCard from './CharacterCard'
import {v4 as uuid} from 'uuid'
import './Character.css'


const CharacterList = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const [characters, setCharacters] = useState(null)

    async function search(){
        let data = await Supabase.getCharacters(user)
        setCharacters(data)
    }

    useEffect(function getCharacters(){
        if (!user) navigate('/')
        if (!characters) search()
    }, [])


    if (!characters) return (<p className='white'>Loading...</p>);

    return (
        <div>
            <h1 className='white'>Characters</h1>
            <Link className={'card'} to={`/characters/add`}>
                <button className='add-btn'>Add New Character!</button>
            </Link>

            {characters.map(c => (
            <CharacterCard 
                key={uuid()}
                name={c.name}
                id={c.id}
            />
            ))}
        </div>
    )
}

export default CharacterList