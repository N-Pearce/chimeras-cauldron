import React, {useEffect, useState, useContext} from 'react'
import { useNavigate, Link, useParams} from 'react-router-dom'
import UserContext from '../auth/UserContext'
import {v4 as uuid} from 'uuid'
import ItemCard from './ItemCard'
import Supabase from '../api-homebrew/Supabase'
import SearchBar from '../SearchBar/SearchBar'

const ItemList = ({isAdd, isEquip}) => {
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  const {character} = useParams()
  const [items, setItems] = useState(null)
  const [term, setTerm] = useState('')
  const [admin, setAdmin] = useState(false)

  function handleSLInfo(evt){
    evt.preventDefault()
    navigate('/share-link-info')
  }

  async function search(){
    let data = await Supabase.getItems(term, user)
    setItems(data)
    let {is_admin} = await Supabase.getUser(user)
    if (is_admin) setAdmin(true)
  }

  useEffect(function getItems(){
    if (!user) navigate('/')
    else search()
  }, [term])


  if (!items) return (<p className='white'>Loading...</p>);

  return (
    <>
        {isAdd ? 
          <div>
            <h1 className='white'>Add to Inventory</h1>
            <Link to={`/characters/${character}`} >
                <button className='back-btn'>Back</button>
            </Link>
          </div>
        :
          <div>
            <h1 className='white'>Items</h1>

            <div style={{display: 'flex', justifyContent: "center", gap: '2%', flexWrap: 'wrap'}}>
              <div style={{flex: ".2", minWidth: 'min(20%, 150px)'}}>
                <Link to={`/items/homebrew/add`}>
                    <button className='mini-btn'>Add Homebrew Item</button>
                </Link>
              </div>

              <div style={{flex: ".2", minWidth: 'min(20%, 150px)'}}>
                <Link to={`/items/share-link/add`} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button className='mini-btn'>Add Share Link!</button>
                    <button style={{position: 'absolute', fontFamily: "Hoefler Text"}} onClick={handleSLInfo}>
                      i
                    </button>
                </Link>
              </div>

              {admin ? 
              
              <div style={{flex: ".2", minWidth: 'min(20%, 150px)'}}>
                <Link to={`/items/5e/add`} style={{marginLeft: '0%'}}>
                    <button className='mini-btn'>Add 5e Item</button>
                </Link>
              </div>
              : ""}
            </div>
            
          </div>
        }
      
      
      <SearchBar search={search}
        term={term}
        setTerm={setTerm}/>
      
        {items.map(i => (
            <ItemCard 
            key={uuid()}
            item={i}
            isAdd={isAdd}
            />
        ))}
    </>
  )
}

export default ItemList