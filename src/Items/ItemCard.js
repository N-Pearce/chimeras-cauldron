import React, {useContext, useEffect, useState} from 'react'
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

    // Increment items on button hold
    const [num, setNum] = useState(0)
    const [count, setCount] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        if (!isRunning) return;


        let interval
        const timeout = setTimeout(function(){
            
            interval = setInterval(() => {
                setCount((count) => {
                    // console.log(count + num)
                    return count + num
                })
                setNumItems((numItems) => numItems + num)
            }, 80)
            
        }, 400)


        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [isRunning])

    const startCounter = (e, newNum) => {
        setIsRunning(true)
        setNum(num => newNum)
    };
    const stopCounter = async () => {
        setIsRunning(false)
        setCount(count => 0)
        await Supabase.updateInventory(inventoryId, numItems+count)
    };

    async function handleIncrement(evt, num) {
        evt.preventDefault()
        await Supabase.updateInventory(inventoryId, numItems+num)
        setNumItems(numItems => numItems + num)
    }
    // End Increment code

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

    let linkTo = `/items/${index ? index : brew_id}/?`
    if (isAdd) linkTo += 'isAdd=true'
    if (state === "isInventory") linkTo += "isInventory=true"
    if (state === 'isEquip') linkTo += `isEquip=true&slot=${slot}`


  return (
    <div className={'card'} // Link
        to={linkTo}>

      <div className='itemCard'>
        <p style={{display: "flex"}}>
            <b style={{flex: "1"}}>
                {itemName}
            </b>

            {state === 'isInventory' ? 
            <b style={{flex: "1"}}>
                Count: {numItems}
                <button onClick={(e) => handleIncrement(e, 1)} onMouseDown={(e) => startCounter(e, 1)} onMouseUp={(e) => stopCounter(e, 1)} onMouseLeave={(e) => stopCounter(e, 1)} className='card-btn'>+1</button>
                <button onClick={(e) => handleIncrement(e, -1)} onMouseDown={(e) => startCounter(e, -1)} onMouseUp={(e) => stopCounter(e, -1)} onMouseLeave={(e) => stopCounter(e, -1)} className='card-btn'>-1</button>
                <button onClick={handleMultipleBtn} className='card-btn'>Add/Remove Multiple</button>
            </b> 

            : isAdd ?
            <button onClick={handleAddToInventory} style={{height: '50px', flex: '.25', marginRight: '10%', marginBottom: '-10%', marginTop: '1%'}}>Add</button>
            
            : state === "isEquip" ?
            <button onClick={handleEquip} style={{height: '50px', flex: '.25', marginRight: '10%', marginBottom: '-10%', marginTop: '1%'}}>Equip</button> 
            
            : ""}
            
        </p>


        {brew_id ? 
            <p style={{marginTop: '-10px'}}>Made by {creator}</p>  
        : ""}
        
        <p><span className={rarity}>{rarity}</span> {type}</p>

        {state === 'isInventory' ? 
            <button className='rmv-btn' onClick={handleRemoveFromInventory}>Remove From Inventory</button>
        : ""}
      </div>
    </div>
  )
}

export default ItemCard