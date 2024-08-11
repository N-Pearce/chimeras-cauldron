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
    <div className='auth'>
        <h1>Add or Remove Multiple</h1>
        <h2>{item.name}</h2>
        <h3>Current Count: {item.num_items}</h3>
        <form onSubmit={handleSubmit}>
            Add or remove from total: <br/>
            (use "-" for removing) <br/>
            <input name="toAdd" type='number' onChange={handleChange}></input>
            <button>Submit</button>
        </form>
    </div>
  )
}

export default UpdateInventory