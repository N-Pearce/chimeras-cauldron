import React, {useContext, useState, useEffect} from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import UserContext from '../../auth/UserContext';
import Supabase from '../../api-homebrew/Supabase';
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

    async function search(){
        let data = await Supabase.getInventory(characterId)
        setInventory(data)
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
            

            <Link 
                to={`/characters/${character}`}>
                <button className='back-btn'>Back</button>
            </Link>
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