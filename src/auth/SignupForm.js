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
    <>
    <h1>Sign Up</h1>
        <div className='auth'>
            <form onSubmit={handleSubmit}>
                <div className='input-field'>
                    <input name="username" onChange={handleChange} required></input>
                    <label>Username</label>
                </div>

                <div className='input-field'>
                    <input name="password" type="password" onChange={handleChange} required></input>
                    <label>Password</label>
                </div>

                <div className='input-field'>
                    <input name="first_name" onChange={handleChange} required></input>
                    <label>First Name</label>
                </div>

                <div className='input-field'>
                    <input name="last_name" onChange={handleChange} required></input>
                    <label>Last Name</label>
                </div>

                <div className='input-field'>
                    <input name="email" type="email" onChange={handleChange} required></input>
                    <label>Email</label>
                </div>

                <button>Submit</button>
            </form>
        </div>
    </>
  )
}

export default SignupForm