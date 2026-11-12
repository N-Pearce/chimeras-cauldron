import React from 'react'
import './Spell.css'
import {Link} from 'react-router-dom'

const SpellCard = ({spell}) => {

    const {brew_id,  index, name, level, school, concentration, ritual, source, user, alternate_creator:alternateCreator} = spell;


    function getLevelText(level){
        if (!level) return "Cantrip"
        if (level === 1) return "1st Level"
        if (level === 2) return "2nd Level"
        if (level === 3) return "3rd Level"
        return `${level}th Level`
    }

    // console.log(url)
    // console.log(index)
    // console.log(ritual)

  return (
    <Link className={'card'} to={`/spells/${index ? index : brew_id}`}>
      <div className='spellCard'>
        <p>
          <b>{name}</b> - <span>Source: {source ? source : alternateCreator ? alternateCreator : user}</span><br/>
          <span>{getLevelText(level)} - {school} {concentration ? " - (Concentration)" : "" }{ritual ? " - [Ritual]" : ""}</span>
        </p>
      </div>
    </Link>
  )
}

export default SpellCard