import React, {useContext, useState, useEffect} from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import UserContext from '../../auth/UserContext';
import Supabase from '../../Database/Supabase';
import ItemCard from '../../Items/ItemCard';
import {v4 as uuid} from 'uuid'

const CharacterInventory = ({isEquip}) => {
    const navigate = useNavigate()
    const {user, characterId} = useContext(UserContext)
    const {character} = useParams();
    const [inventory, setInventory] = useState(null)
    const [rerender, setRerender] = useState(false)
    const query = new URLSearchParams(useLocation().search)
    const slot = query.get('slot')

    const [attunedItems, setAttunedItems] = useState(0)
    const [totalItems, setTotalItems] = useState(0)

    async function search(){
        setTotalItems(0)
        setAttunedItems(0)
        
        let data = await Supabase.getInventory(characterId)
        setInventory(data)
        for (let item of data){
            setTotalItems(totalItems => totalItems + 1)

            if (item.attunement) setAttunedItems(attunedItems => attunedItems + 1)
        }
    }

    useEffect(function getCharacters(){
        setInventory(null)
        if (!user) navigate('/')
        else search()
    }, [rerender])
    
    function sameSlot(item){
        // return all items if no slot to filter by
        if (!slot) return true
        return item.slot === slot
    }

    if (!inventory) return (<p className='white'>Loading...</p>);

    return (
        <div>
            <h1 className='white'>
                {isEquip ? `Choose ${slot}` : `${character}'s Inventory`}
            </h1>
            

            <Link to={`/characters/${character}`}>
                <button className='back-btn'>Back</button>
            </Link>
            <Link to={`/characters/${character}/inventory/add`}>
                <button className='back-btn'>Add Items</button>
            </Link>
            <h4 className='white' style={{textAlign: 'left', paddingLeft: '3%'}}>
            Attuned Items: {attunedItems}
            <br></br>
            Total Items: {totalItems}
            </h4>

            {inventory.filter(sameSlot).map(i => (
                <ItemCard
                key={uuid()}
                item={i}
                slot={slot}
                state={isEquip ? "isEquip" : "isInventory"}
                rerender={rerender}
                setRerender={setRerender}
                />
            ))}
        </div>
    )
}

export default CharacterInventory