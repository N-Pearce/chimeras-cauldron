import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../auth/UserContext'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Supabase from '../api-homebrew/Supabase'
import Alert from '../common/Alert'

const Profile = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const {user:curUser} = useParams()
    const [userData, setUserData] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        share_link: ''
    })
    const [saveConfirmed, setSaveConfirmed] = useState(false)

    const handleChange = evt => {
        const {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function updateProfile(){
        try {
            let {username} = formData
            let profileData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email
            }
            await Supabase.updateUser(username, profileData)
            setSaveConfirmed(true)
        } catch(error) {
            console.log(error)
        }
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        updateProfile()
    }

    useEffect(() => {
        async function getUserData(){
            if (!user || user !== curUser){
                navigate('/')
            } else {
                let thisUser = await Supabase.getUser(user)
                setUserData(thisUser)
                setFormData(thisUser)
            }
        }
        getUserData()
    }, [])

    if (!userData) return <p className='white'>Loading...</p>

    return (
        <>
        <h1 className='white' style={{textAlign: 'center'}}>Profile</h1>
        <div className='auth' style={{paddingLeft: 10, paddingRight: 10}}>
            <form onSubmit={handleSubmit}>
                
                <div className='input-field'>
                    <input name="username" value={formData.username} style={{backgroundColor: 'rgba(200,200,200, .4)'}}></input>
                    <label>Username</label>
                </div>
                <div className='input-field'>
                    <input name="first_name" value={formData.first_name} onChange={handleChange}></input>
                    <label>First Name</label>
                </div>
                <div className='input-field'>
                    <input name="last_name" value={formData.last_name} onChange={handleChange}></input>
                    <label>Last Name</label>
                </div>
                <div className='input-field'>
                    <input name="email" value={formData.email} onChange={handleChange}></input>
                    <label>Email</label>
                </div>
                
                <div className='input-field'>
                    <input name="share_link" value={`user-${formData.share_link}`} style={{backgroundColor: 'rgba(200,200,200, .4)'}}></input>
                    <label>
                        Share Link 
                    </label>
                    
                    <Link style={{position: 'absolute', height: '20%', left: "80px"}} to='/share-link-info'>
                        <button style={{position: 'absolute', borderRadius: "25px", height: '100%', width: '20px', top: '5%', left: '60%', fontFamily: "Hoefler Text"}}>
                            i
                        </button>
                    </Link>
                </div>
                <br/>
                {saveConfirmed
                    ? <Alert type="success" messages={["Updated successfully."]} />
                    : null}
                
                <button>Update</button>
            </form>
        </div>
        </>
    )
}

export default Profile