import React from 'react'
// import './Spell.css'
import {Link} from 'react-router-dom'

const ClassCard = ({name}) => {


    // console.log(url)
    // console.log(index)


  return (
    <Link className={'card'} to={`/classes/${name}`}>
      <div className='spellCard'>
        <p>
          <b>{name}</b><br/>
        </p>
      </div>
    </Link>
  )
}

export default ClassCard