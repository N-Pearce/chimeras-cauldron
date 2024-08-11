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
            let thisUser = await Supabase.updateUser(username, profileData)
            setSaveConfirmed(true)
        } catch(error) {
            console.log(error)
        }
    }

    function handleSubmit(evt) {
        evt.preventDefault()
        console.log(687)
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
        <div style={{paddingLeft: 10, paddingRight: 10}}>
            <h1 style={{textAlign: 'center'}}>Profile</h1>
            <form className='auth' onSubmit={handleSubmit}>
                Username:
                <input name='username' value={formData.username} style={{backgroundColor: "lightGray"}} readOnly></input><br/>
                First Name:
                <input name='first_name' value={formData.first_name} onChange={handleChange}></input><br/>
                Last Name:
                <input name='last_name' value={formData.last_name} onChange={handleChange}></input><br/>
                Email: <br/>
                <input name='email' value={formData.email} onChange={handleChange}></input><br/>
                Share Link: 
                
                <Link style={{position: 'relative'}} to='/share-link-info'>
                    <button style={{position: 'absolute', borderRadius: "25px", backgroundColor: 'grey', height: '90%', width: '20px', top: -17, left: -15, fontFamily: "Hoefler Text"}}>
                        i
                    </button>
                </Link>
                <br/>
                <input name='share_link' value={`user-${formData.share_link}`} style={{backgroundColor: 'lightgray'}} readOnly></input>

                {saveConfirmed
                    ? <Alert type="success" messages={["Updated successfully."]} />
                    : null}
                
                <button>Update</button>
            </form>
        </div>
    )
}

export default Profile