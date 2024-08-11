import React, {useEffect, useState, useContext} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import UserContext from '../auth/UserContext'
import {v4 as uuid} from 'uuid'
import Dnd5eApi from '../api-5e/api'

const SpellDetails = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const {index} = useParams();
    const [spell, setSpell] = useState(null)

    function getLevelText(level){
        if (!level) return "Cantrip"
        if (level === 1) return "1st Level"
        if (level === 2) return "2nd Level"
        if (level === 3) return "3rd Level"
        return `${level}th Level`
    }

    async function search(index){
        let data = await Dnd5eApi.getSpell(index)
        setSpell(data)
    }

    useEffect(function getSpell(){
        if (!user) navigate('/')
        search(index)
    }, [])


    if (!spell) return <h1>Loading...</h1>

    const {name, desc, higher_level, range, components, material, ritual, duration} = spell
    const {concentration, casting_time, level, classes} = spell
    const school = spell.school.name

    let boldedDesc = []
    desc.map(d => (
        boldedDesc.push(d.replace(/\*\*\*([^*]*(?:\*(?!\*)[^*]*)*)\*\*\*/g, '<b>$1</b>'))
    ))

    return (
    <>
        <Link to={`/spells`} >
            <button className='back-btn'>Back</button>
        </Link>

        <div className='itemCard' style={{paddingLeft: 10, paddingRight: 10}}>
            <h1>{name}</h1>

            <p>{getLevelText(level)} {school} {ritual ? '(ritual)' : ''}</p>

            <p><b>Casting Time:</b> {casting_time} <br/>
            <b>Range:</b> {range} <br/>
            <b>Components:</b> {components} {material ? `(${material})` : ''} <br/>
            <b>Duration:</b> {concentration ? 'Concentration, ' : ''}{duration}</p>

            {boldedDesc.map((b, index) => (
                <p key={uuid()} dangerouslySetInnerHTML={{__html: boldedDesc[index]}}></p>
            ))}

            {higher_level[0] ? 
                higher_level.map(h => (
                    <p key={uuid()}><b>At Higher Levels: </b>{h}</p>
                ))
            :''}

            <p><b>Classes: </b>
                {classes.map((c, index) => (
                    <span key={uuid()}>{c.name}{index !== classes.length -1 ? ', ' : ''}</span>
                ))}
            </p>

            <br/>
        </div>
    </>
  )
}

export default SpellDetails