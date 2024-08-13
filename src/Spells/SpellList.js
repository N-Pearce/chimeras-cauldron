import React, {useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../auth/UserContext'
import SearchBar from '../SearchBar/SearchBar'
import SpellCard from './SpellCard'
import Dnd5eApi from '../api-5e/api'
import {v4 as uuid} from 'uuid'

const SpellList = () => {
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  const [spells, setSpells] = useState(null)
  const [term, setTerm] = useState("")

  async function search(){
    let data = await Dnd5eApi.getSpells(term)
    setSpells(data)
  }

  useEffect(function getSpells(){
    if (!user) navigate('/')
    else search()
  }, [term])



  if (!spells) return (<p className='white'>Loading...</p>);

  return (
    <>
      <h1 className='white'>Spells</h1>
      <SearchBar search={search}
        term={term}
        setTerm={setTerm}/>
      {spells.map(s => (
        <SpellCard 
          key={uuid()}
          index={s.index}
          name={s.name}
          level={s.level}
        />
      ))}
    </>
  )
}

export default SpellList