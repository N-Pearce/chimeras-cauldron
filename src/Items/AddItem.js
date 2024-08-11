import React, {useContext, useState, useEffect} from 'react'
import {useNavigate, useParams, Link} from 'react-router-dom'
import Alert from '../common/Alert'
import Supabase from '../api-homebrew/Supabase'
import UserContext from '../auth/UserContext'

const AddItem = () => {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const {source} = useParams()
    const [failed, setFailed] = useState(null)
    const [shareLink, setShareLink] = useState({share_link: ""})
    const [formData, setFormData] = useState({
        name: "",
        rarity: "Common",
        type: "Armor",
        slot: "Headwear",
        attunement: false,
        description: ""
    })

    const handleSLChange = evt => {
        let {name, value} = evt.target
        setShareLink(fData => ({
            ...fData,
            [name]: value
        }))
    }

    async function handleSLSubmit(evt){
        evt.preventDefault()
        try {
            await Supabase.addShareLink(shareLink, user)
            navigate('/items')
        } catch (error){
            setFailed(true)
        }
    }

    const handleChange = evt => {
        let {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }))
    }

    const handleChecked = evt => {
        let {name, checked} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: checked
        }))
    }

    async function handleSubmit(evt) {
        evt.preventDefault()
        await Supabase.addItem(formData, source, user)
        navigate('/items')
    }

    useEffect(() => {
        if (!user) navigate('/')
    }, [])

    if (source === "share-link"){
        return (
            <>
                <div className='auth'>
                    <h1>Add Share Link</h1>
                    <form onSubmit={handleSLSubmit}>
                        Share Link
                        <input name="share_link" onChange={handleSLChange}></input>
                        {failed
                        ? <Alert messages={["Please enter a valid share link."]} />
                        : null}
                        <button>Submit</button>
                    </form>
                </div>
                <br/>
                
                <Link to={`/items`} >
                    <button className='back-btn'>Back</button>
                </Link>
            </>
        )
    }

  return (
    <>
        <div className='auth'>
            <h1>Add {source === 'homebrew' ? "Homebrew" : "5e"} Item</h1>
            <form onSubmit={handleSubmit}>
                Name
                <input name="name" onChange={handleChange} required></input>
                Rarity
                <select name='rarity' onChange={handleChange}>
                    <option>Common</option>
                    <option>Uncommon</option>
                    <option>Rare</option>
                    <option>Very Rare</option>
                    <option>Legendary</option>
                    <option>Artifact</option>
                    <option>Varies</option>
                    <option>Unknown Rarity</option>
                </select>
                Type
                <select name='type' onChange={handleChange}>
                    <option>Armor</option>
                    <option>Potion</option>
                    <option>Ring</option>
                    <option>Rod</option>
                    <option>Scroll</option>
                    <option>Staff</option>
                    <option>Wand</option>
                    <option>Weapon</option>
                    <option>Wondrous Item</option>
                </select>
                Slot
                <select name='slot' onChange={handleChange}>
                    <option>Headwear</option>
                    <option>Cloak</option>
                    <option>Amulet</option>
                    <option>Armor</option>
                    <option>Bracers</option>
                    <option>Gloves</option>
                    <option>Footwear</option>
                    <option>Wielded Item</option>
                    <option>Ring</option>
                    <option>Misc</option>
                </select>
                Attunement?
                <input name="attunement" type='checkbox' onChange={handleChecked}></input>
                <br/>
                Description <br/><br/>
                (Text wrapped in ***triple asterisks*** will appear bold <br/>
                ---Text after three hyphens will start a new paragraph)
                <input name="description" type='text' onChange={handleChange} required></input>
                <button>Submit</button>
            </form>
        </div>
        <br/>
        
        <Link to={`/items`} >
            <button className='back-btn'>Back</button>
        </Link>
        <br/>
        <br/>
    </>
  )
}

export default AddItem