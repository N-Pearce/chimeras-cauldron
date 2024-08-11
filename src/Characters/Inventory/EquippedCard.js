import React from 'react'
import { Link, useParams } from 'react-router-dom';
import Supabase from '../../api-homebrew/Supabase';

const EquippedCard = ({item, slot, rerender, setRerender}) => {
    const {character} = useParams()
    let id, name, rarity, attunement
    if (item) {
        ({id, name, rarity, attunement} = item)
    }
    
  async function handleUnequip(evt, inventoryId){
    evt.preventDefault()
    await Supabase.removeFromEquipped(inventoryId)
    setRerender(!rerender)
  }

  return (
    <Link className={'card'} to={`/characters/${character}/inventory/equip?slot=${slot}`}>
        <div className='itemCard'>
        {item ?
            <div>
            <p style={{position: 'relative'}}>
            <b>{name}</b>
            
            {attunement ? 
              <b className='white' style={{position: 'absolute', marginLeft: '1.5%', marginTop: ".5%", fontSize: "10px"}}>
                A
              </b>
            : ""}
            <img className={`triangle ${rarity}`}></img>

            <span style={{marginLeft: '1%'}}>({slot})</span>
            <button className='largeBtn' onClick={(e) => handleUnequip(e, id)}>
                Unequip
            </button>
            <br/>
            <span style={{color: 'gray'}}>(Click to change)</span>
            </p>
            
            </div> 
        : 
        <p><b>Choose {slot}</b></p>}
        </div>
    </Link>
  )
}

export default EquippedCard