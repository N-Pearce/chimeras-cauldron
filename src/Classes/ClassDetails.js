import React, {useEffect, useState, useContext} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import UserContext from '../auth/UserContext'
import {v4 as uuid} from 'uuid'
import Supabase from '../Database/Supabase'

const ClassDetails = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const name = useParams().class;
    const [classFeatures, setClassFeatures] = useState(null);
    const [characters, setCharacters] = useState(null)
    const [done, setDone] = useState(null)


    async function search(name){
        let data = await Supabase.getClassFeatures(name)
        setClassFeatures(data)
        let data2 = await Supabase.getCharacters(user)
        setCharacters(data2)
        setDone(true)
    }

    async function addClassFeature(charId, classFeatId){
        await Supabase.addCharacterClassFeature(charId, classFeatId)
    }

    useEffect(function getClassFeatures(){
        if (!user) navigate('/')
        search(name)
    }, [])
    
    
    if (!done) return <p className='white'>Loading...</p>
    
    return (
    <>
        <Link to={`/classes`} >
            <button className='back-btn'>Back</button>
        </Link>
        <div className='itemCard' style={{paddingLeft: 10, paddingRight: 10}}>
            <h1>{name}</h1>

            {classFeatures ? classFeatures.map(feature => 
                <div key={feature.id}>
                    <h2>Level {feature.level}: {feature.name}</h2>
                    <p>{feature.desc}</p><br/>
                    {characters.map(c => 
                        <button key={`${feature.id}-${c.name}}`} 
                        style={{marginRight:"1rem"}}
                        onClick={() => addClassFeature(c.id, feature.id)}>
                            Add to {c.name}
                        </button>
                    )}
                </div>
            ) : ""}

           

            <br/>
        </div>
    </>
  )
}

export default ClassDetails