import React from 'react'
import './Spell.css'
import {Link} from 'react-router-dom'

const SpellCard = ({index, name, level, url}) => {

    function getLevelText(level){
        if (!level) return "Cantrip"
        if (level === 1) return "1st Level"
        if (level === 2) return "2nd Level"
        if (level === 3) return "3rd Level"
        return `${level}th Level`
    }

    // console.log(url)
    // console.log(index)


  return (
    <Link className={'card'} to={`/spells/${index}`}>
      <div className='spellCard'>
        <p>
          <b>{name}</b> <span>Source - {url ? "D&D 5e" : ""}</span><br/>
          {getLevelText(level)}
        </p>
      </div>
    </Link>
  )
}

export default SpellCard