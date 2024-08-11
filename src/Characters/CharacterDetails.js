import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import UserContext from '../auth/UserContext';
import Supabase from '../api-homebrew/Supabase';
import EquippedCard from './Inventory/EquippedCard';
import {v4 as uuid} from 'uuid'

const CharacterDetails = () => {
  const navigate = useNavigate()
  const {character} = useParams();
  const {user, characterId} = useContext(UserContext)
  const [done, setDone] = useState(false)
  const [rerender, setRerender] = useState(false)
  const [attunedItems, setAttunedItems] = useState(0)
  const [equipped, setEquipped] = useState({
    Headwear: null,
    Cloak: null,
    Amulet: null,
    Armor: null,
    Gloves: null,
    Bracers: null,
    Footwear: null,
    "Wielded Item": null,
    Ring: null,
    Misc: null
  })

  async function search(){
    let data = await Supabase.getAllEquipped(characterId)
    let currentEquips = [];
    for (let item of data){
      const {id, slot, name, rarity, attunement} = item
      if (attunement) setAttunedItems(attunedItems => attunedItems + 1)
      setEquipped(fData => ({
          ...fData,
          [slot]: {
            id: id,
            name: name,
            rarity: rarity,
            attunement: attunement
          }
      }))
      currentEquips.push(item.slot)
    }

    for (let slot of Object.keys(equipped)){
      if(!currentEquips.includes(slot)){
        setEquipped(fData => ({
          ...fData,
          [slot]: null
        }))
      }
    }

    setDone(true)
  }


  useEffect(() => {
    setDone(false)
    if (!user) navigate('/')
    else search()
  }, [rerender, user])



  if (!done) return <p>Loading</p>

  return (
    <>
    <h1>{character}</h1>

      <div style={{display: "flex"}}>
        <Link to={`/characters/${character}/inventory`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
            <p>Inventory</p>
        </Link>
        <Link to={`/characters/${character}/inventory/add`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
            <p>Add to Inventory</p>
        </Link>
      </div>

      <h4 className='white' style={{textAlign: 'left', paddingLeft: '3%'}}>
        Attuned Items: {attunedItems}
      </h4>

      {Object.keys(equipped).map(key => (
        <EquippedCard
          key={uuid()}
          item={equipped[key]}
          slot={key}
          rerender={rerender}
          setRerender={setRerender}
        />
      ))}
    </>
  )
}

export default CharacterDetails