import React from 'react'
import './Spell.css'
import {Link} from 'react-router-dom'

const SpellCard = ({index, name, level}) => {

    function getLevelText(level){
        if (!level) return "Cantrip"
        if (level === 1) return "1st Level"
        if (level === 2) return "2nd Level"
        if (level === 3) return "3rd Level"
        return `${level}th Level`
    }


  return (
    <Link className={'card'} to={`/spells/${index}`}>
      <div className='spellCard'>
        <p>
          <b>{name}</b> <br/>
          {getLevelText(level)}
        </p>
      </div>
    </Link>
  )
}

export default SpellCard