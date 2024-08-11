import React, {useContext, useState} from 'react'
import './Item.css'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Supabase from '../api-homebrew/Supabase'
import UserContext from '../auth/UserContext'

const ItemCard = ({item, slot, state, isAdd, rerender, setRerender}) => {
    const navigate = useNavigate()
    const {characterId} = useContext(UserContext)
    const {character} = useParams()
    // item from inventory, then all items
    const {id:inventoryId, num_items} = item;
    const {brew_id, user:creator, name:itemName, rarity, type} = item;
    let {item_5e_index:index} = item;
    if (item.index) index = item.index
    const [numItems, setNumItems] = useState(num_items)

    async function handleIncrement(evt, num) {
        evt.preventDefault()
        await Supabase.updateInventory(inventoryId, numItems+num)
        setNumItems(numItems => numItems + num)
    }

    async function handleMultipleBtn(evt){
        evt.preventDefault()
        navigate(`/characters/${character}/inventory/${inventoryId}/update`)
    }

    async function handleAddToInventory(evt){
        evt.preventDefault()
        await Supabase.addToInventory(item, characterId)
        navigate(`/characters/${character}`)
    }

    async function handleEquip(evt){
        evt.preventDefault()
        await Supabase.equipItem(inventoryId, slot, characterId)
        navigate(`/characters/${character}`)
    }

    async function handleRemoveFromInventory(evt){
        evt.preventDefault()
        await Supabase.removeFromInventory(inventoryId)
        setRerender(!rerender)
    }

  return (
    <Link className={'card'} 
        to={`/items/${index ? index : brew_id}/?
        ${isAdd ? 'isAdd=true' : ''}
        ${state === "isInventory" ? '&isInventory=true' : 
        state === "isEquip" ? `&isEquip=true&slot=${slot}` : ''}`}>

      <div className='itemCard'>
        <p style={{display: "flex"}}>
            <b style={{flex: "1"}}>
                {itemName}
            </b>


            {state === 'isInventory' ? 
            <b style={{flex: "1.8"}}>
                Count: {numItems}
                <button onClick={(e) => handleIncrement(e, 1)} className='card-btn'>+1</button>
                <button onClick={(e) => handleIncrement(e, -1)} className='card-btn'>-1</button>
                <button onClick={handleMultipleBtn} className='card-btn'>Add/Remove Multiple</button>
            </b> 

            : isAdd ?
            <button onClick={handleAddToInventory} style={{height: '50px', flex: '.25', marginRight: '10%', marginBottom: '-10%', marginTop: '1%'}}>Add</button>
            
            : state === "isEquip" ?
            <button onClick={handleEquip} style={{height: '50px', flex: '.25', marginRight: '10%', marginBottom: '-10%', marginTop: '1%'}}>Equip</button> 
            
            : ""}
            
        </p>


        {brew_id ? 
            <p style={{marginTop: '-20px'}}>Made by {creator}</p>  
        : ""}
        
        <p><span className={rarity}>{rarity}</span> {type}</p>

        {state === 'isInventory' ? 
            <button className='rmv-btn' onClick={handleRemoveFromInventory}>Remove From Inventory</button>
        : ""}
      </div>
    </Link>
  )
}

export default ItemCard