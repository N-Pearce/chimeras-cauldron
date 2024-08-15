import React, {useEffect, useState, useContext} from 'react'
import {useParams, useNavigate, Link, useLocation} from 'react-router-dom'
import UserContext from '../auth/UserContext'
import {v4 as uuid} from 'uuid'
import Supabase from '../api-homebrew/Supabase'

const ItemDetails = () => {
    const navigate = useNavigate()
    const {user, characterId} = useContext(UserContext)
    const {index} = useParams();
    const [item, setItem] = useState(null)
    const [sharedUsers, setSharedUsers] = useState([])
    const [character, setCharacter] = useState(null)
    const query = new URLSearchParams(useLocation().search)
    const isAdd = query.get('isAdd')
    const isEquip = query.get('isEquip')
    const slot = query.get('slot')

    const [rerender, setRerender] = useState(false)

    async function handleAddToInventory(evt){
        evt.preventDefault()
        await Supabase.addToInventory(item, characterId)
        navigate(`/characters/${character}`)
    }
    
    async function handleEquip(evt){
        evt.preventDefault()
        let id = await Supabase.findInventoryItem(characterId, index)
        await Supabase.equipItem(id, slot, characterId)
        navigate(`/characters/${character}`)
    }

    async function search(index){
        let data = await Supabase.getItem(index)
        // characterId is null if user went through itemList rather than inventory
        if (characterId) {
            let cName = await Supabase.getCharacterName(characterId)
            setCharacter(cName)
        }
        if (data.share_link && user === data.user){
            const sharedUsersArr = await Supabase.getSharedUsers(data.share_link, user)
            let arr1 = sharedUsersArr.filter(u => u.link_type === "user")
            let arr2 = sharedUsersArr.filter(u => u.link_type === "item")
            let arr3 = [arr1, arr2]
            setSharedUsers(arr3)
        }
        setItem(data)
    }

    useEffect(function getItem(){
        if (!user) navigate('/')
        search(index)
    }, [rerender])

    async function rmvSharedUser(e, share_link, linkType, userToRemove){
      await Supabase.removeSharedUser(share_link, linkType, user, userToRemove)
      setRerender(!rerender)
    }

    if (!item) return <h1>Loading...</h1>

    const {name, slot:itemSlot, rarity, type, description, attunement, user:creator, share_link} = item

    let splitDesc = description.split('---')
    let boldedDesc = []
    splitDesc.map(d => (
        boldedDesc.push(d.replace(/\*\*\*([^*]*(?:\*(?!\*)[^*]*)*)\*\*\*/g, '<b>$1</b>'))
    ))

    return (
    <>
        {isAdd ? 
        <button className='back-btn' onClick={handleAddToInventory} style={{marginRight: '5%'}}>Add</button>
        : isEquip ?
        <button className='back-btn' onClick={handleEquip} style={{marginRight: '5%'}}>
            Equip
        </button>
        :
        ""}

        {/* default links back from isInventory */}
        {query.size > 0 ? 
        <Link to={`/characters/${character}/inventory${isAdd ? "/add" : isEquip ? `/equip?slot=${slot}` : ""}`}>
            <button className='back-btn'>Back</button>
        </Link>
        : 
        <Link to={`/items`}>
            <button className='back-btn'>Back</button>
        </Link>}


        <div className='itemCard' style={{paddingLeft: 10, paddingRight: 10}}>
            <h1>{name}</h1>
            <p><span className={rarity}>{rarity}</span> {type} {attunement ? "(requires attunement)" : ""}</p>
            <p><b>Slot:</b> {itemSlot}</p>

            {boldedDesc.map((b, index) => (
                <p key={uuid()} dangerouslySetInnerHTML={{__html: boldedDesc[index]}}></p>
            ))}
            {/* <p>{description}</p> */}


            {share_link && user === creator ? 
            <div>
                <br/>
                <p><b>Share Link:</b> item-{share_link}</p>

                {sharedUsers[0][0] || sharedUsers[1][0] ?
                    <p><b>Users who can see this item:</b></p>
                : ''}

                {sharedUsers[0][0] ? 
                <div>
                    <p><b>(From User Link)</b></p>
                    {sharedUsers[0].map(u => (
                        <div style={{display: "flex", height: "50px"}} key={uuid()}>
                            <p>
                                {u.user}
                            </p> 
                            <button className='rmv-btn' onClick={e => rmvSharedUser(e, share_link, "user", u.user)} style={{marginTop: '2%', marginLeft: '7%'}}>
                                Remove
                            </button>
                        </div>
                    ))}
                    </div>
                : ""}

                {sharedUsers[1][0] ? 
                <div>
                    <p><b>(From Item Link)</b></p>
                    {sharedUsers[1].map(u => (
                        <div style={{display: "flex", height: "50px"}} key={uuid()}>
                            <p>
                                {u.user}
                            </p> 
                            <button className='rmv-btn' onClick={e => rmvSharedUser(e, share_link, "item", u.user)} style={{marginTop: '2%', marginLeft: '7%'}}>
                                Remove
                            </button>
                        </div>
                    ))}
                    </div>
                : ""}

            </div>
            : ''}
            <br/>
        </div>
    </>
  )
}

export default ItemDetails