import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './auth.css'

const SignupForm = ({signup}) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: ''
    })

    const handleChange = evt => {
        const {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        signup(formData)
        navigate('/')
    }

  return (
    <div className='auth'>
        <form onSubmit={handleSubmit}>
            Username
            <input name="username" onChange={handleChange} required></input>
            Password
            <input name="password" type='password' onChange={handleChange} required></input>
            First Name
            <input name="first_name" onChange={handleChange} required></input>
            Last Name
            <input name="last_name" onChange={handleChange} required></input>
            Email
            <input name="email" type='email' onChange={handleChange} required></input>
            <button>Submit</button>
        </form>
    </div>
  )
}

export default SignupForm