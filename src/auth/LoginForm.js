import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Alert from '../common/Alert'
import "./auth.css"

const LoginForm = ({login}) => {
    const navigate = useNavigate()
    const [failed, setFailed] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const handleChange = evt => {
        const {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handleSubmit(evt) {
        evt.preventDefault()
        let res = await login(formData)
        if (res.success) navigate('/')
        else setFailed(res)
    }

    return (
        <div className='auth'>
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input name="username" onChange={handleChange} required></input>
                </label>
                <label>
                    Password
                    <input name="password" type='password' onChange={handleChange} required></input>
                </label>
                {failed
                    ? <Alert messages={["Login Failed."]} />
                    : null}
                <button>Submit</button>
            </form>
        </div>
    )
}

export default LoginForm