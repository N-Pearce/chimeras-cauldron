import React, {useContext, useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import UserContext from '../auth/UserContext'
import Supabase from '../Database/Supabase'
import SearchBar from '../SearchBar/SearchBar'
import MtgCard from './MtgCard'
import {v4 as uuid} from 'uuid'

const MtgCardList = () => {
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  const [mtgCards, setMtgCards] = useState(null)
  const [term, setTerm] = useState("")

  async function search(){
    let data = await Supabase.getMtgCards(user)
    setMtgCards(data)
    console.log(data)
    console.log(mtgCards)
  }

  useEffect(function getSpells(){
    if (!user) navigate('/')
    else search()
  }, [term])



  if (!mtgCards) return (<p className='white'>Loading...</p>);

  return (
    <>
      <h1 className='white'>Spells</h1>
      <SearchBar search={search}
        term={term}
        setTerm={setTerm}/>
      {mtgCards.map(s => (
        <MtgCard 
          key={uuid()}
          index={s.index}
          title={s.title}
          colors={s.colors}
          // jpg={s.jpg}
        />
      ))}
    </>
  )
}

export default MtgCardList