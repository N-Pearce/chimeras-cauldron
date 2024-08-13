import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Supabase from '../../api-homebrew/Supabase'

const UpdateInventory = () => {
    const navigate = useNavigate()
    const {user, character, id} = useParams()
    const [item, setItem] = useState()
    const [formData, setFormData] = useState({
        toAdd: 0
    })

    const handleChange = evt => {
        const {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handleSubmit(evt){
        evt.preventDefault()
        await Supabase.updateInventory(id, item.num_items + +formData.toAdd)
        navigate(`/characters/${character}/inventory`)
    }

    useEffect(() => {
        async function getItem() {
            let data = await Supabase.getInventoryItem(id)
            setItem(data)
        }
        getItem()
    }, [])

    if (!item) return <p className='white'>Loading...</p>

  return (
    <>
        <h1 className='white'>Add or Remove Multiple</h1>
        <div className='auth'>
            <form onSubmit={handleSubmit}>
                
            <h2 className='white'>{item.name}</h2>
            <h3 className='white' style={{margin: 0}}>Current Count: {item.num_items}</h3>

            
                <div className='input-field'>
                    <input name="toAdd" type="number" onChange={handleChange} required></input>
                    <label>Add/Remove Amount</label>
                </div>
                
                <p className='pLabel' style={{marginTop: 0}}>
                use "-" for subtracting
                </p>
                <button>Submit</button>
            </form>
        </div>
    </>
  )
}

export default UpdateInventory