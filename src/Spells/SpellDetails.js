import React, {useEffect, useState, useContext} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import UserContext from '../auth/UserContext'
import {v4 as uuid} from 'uuid'
import Dnd5eApi from '../api-5e/api'
import Supabase from '../Database/Supabase'

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
        let data = await Supabase.getSpell(index)
        setSpell(data)
    }

    useEffect(function getSpell(){
        if (!user) navigate('/')
        search(index)
    }, [])


    if (!spell) return <h1>Loading...</h1>

    const {name, desc, higher_level, range, components, material, ritual, duration} = spell
    const {concentration, casting_time, level, classes, school} = spell

    // let boldedDesc = []
    // desc.map(d => (
    //     boldedDesc.push(d.replace(/\*\*\*([^*]*(?:\*(?!\*)[^*]*)*)\*\*\*/g, '<b>$1</b>'))
    // ))
    // // console.log(spell)
    
    
    let splitDesc = desc.split('---')
    // console.log(splitDesc)
    // for (let i=0; i<splitDesc.length; i++){
    //     console.log(splitDesc[i])
    //     let boldDesc = splitDesc[i].split("**")
    //     console.log(boldDesc)
    // }

    // let boldDesc = desc.split('**')
    // console.log(boldDesc)


    return (
    <>
        <Link to={`/spells`} >
            <button className='back-btn'>Back</button>
        </Link>

        <div className='itemCard' style={{paddingLeft: 10, paddingRight: 10}}>
            <h1>{name}</h1>

            {level > 0 ? 
            <p>{getLevelText(level)} {school}</p>
            : <p>{school} {getLevelText(level)}</p>}
            

            <p><b>Casting Time:</b> {casting_time} {ritual ? '(ritual)' : ''}<br/>
            <b>Range:</b> {range} <br/>
            <b>Components:</b> {components} <br/>
            {/* <b>Components:</b> {components.join(', ')} {material ? `(${material})` : ''} <br/> */}
            <b>Duration:</b> {duration}</p>


            <p>{splitDesc.map((s, sIndex) => (
                s.split("**").map((b, bIndex) => (
                    <span key={uuid()}>
                        {b == "" ? "" 
                        : bIndex%2==1 ? <b>{b}</b> 
                        : <span>{b}<br/><br/></span>}
                    </span>
                ))

                 

                // splitDesc[index].map((m, index) =>(
                //     <p>{index}</p>
                // ))
                // <p key={uuid()} dangerouslySetInnerHTML={{__html: splitDesc[index]}}></p>
            ))}</p>
            

            {higher_level ? 
                <p><b>{level > 0 ? "Using a Higher-Level Spell Slot." : "Cantrip Upgrade."}</b> {higher_level}</p>
            : ""}
            

            {/* {higher_level[0] ? 
                higher_level.map(h => (
                    <p key={uuid()}><b>At Higher Levels: </b>{h}</p>
                ))
            :''} */}

            <p><b>Classes: </b> {classes}
                {/* {classes.map((c, index) => (
                    <span key={uuid()}>{c.name}{index !== classes.length -1 ? ', ' : ''}</span>
                ))} */}
            </p>

            <br/>
        </div>
    </>
  )
}

export default SpellDetails