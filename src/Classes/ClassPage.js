import React, {useContext, useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import UserContext from '../auth/UserContext'
import Supabase from '../Database/Supabase'
// import CharacterCard from './CharacterCard'
import {v4 as uuid} from 'uuid'
import ClassCard from './ClassCard'
// import './Character.css'


const ClassPage = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const [characters, setCharacters] = useState(null)

    // async function search(){
    //     let data = await Supabase.getCharacters(user)
    //     setCharacters(data)
    // }

    useEffect(function getCharacters(){
        if (!user) navigate('/')
        // if (!characters) search()
    }, [])


    let classes=[{name: "Barbarian"}, {name: "Bard"}, {name:"Cleric"}, {name:"Druid"}, {name:"Wizard"}]
    // if (!characters) return (<p className='white'>Loading...</p>);

    return (
        <div>
            <h1 className='white'>Classes</h1>
            {classes.map(c => 
                <ClassCard 
                    key={c.name}
                    name={c.name}
                />
            )}
        </div>
    )
}

export default ClassPage