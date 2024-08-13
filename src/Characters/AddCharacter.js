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
    <>
        <h1 className='white'>Add Character</h1>
        <div className='auth'>
            <form onSubmit={handleSubmit}>
                <div className='input-field'>
                    <input name="name" onChange={handleChange} required></input>
                    <label>Name</label>
                </div>
                <button>Submit</button>
            </form>
        </div>
    </>
  )
}

export default AddCharacter