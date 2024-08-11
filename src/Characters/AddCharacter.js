import React, {useState, useContext, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import UserContext from '../auth/UserContext'
import Supabase from '../api-homebrew/Supabase'

const AddCharacter = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const [formData, setFormData] = useState({
        user_name: user,
        name: "",
    })

    const handleChange = evt => {
        let {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handleSubmit(evt) {
        evt.preventDefault()
        await Supabase.addCharacter(formData)
        navigate(`/characters`)
    }

    useEffect(() => {
        if (!user) navigate('/')
    }, [])

  return (
    <div className='auth'>
        <form onSubmit={handleSubmit}>
            Name
            <input name="name" onChange={handleChange} required></input>
            <button>Submit</button>
        </form>
    </div>
  )
}

export default AddCharacter