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
        attunement: "Not Required",
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
                <h1 className='white'>Add Share Link</h1>
                <div className='auth'>
                    <form onSubmit={handleSLSubmit}>

                        <div className='input-field'>
                            <input name="share_link" onChange={handleSLChange} required></input>
                            <label>Share Link</label>
                        </div>
                        <br/>

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
        <h1 className='white'>Add {source === 'homebrew' ? "Homebrew" : "5e"} Item</h1>
        <div className='auth'>
            <form onSubmit={handleSubmit}>

                <div className='input-field'>
                    <input name="name" onChange={handleChange} required></input>
                    <label>Name</label>
                </div>

                <div className='input-field'>
                    <p className='pLabel'>Rarity</p>
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
                </div>
                
                <div className='input-field'>
                    <p className='pLabel'>Type</p>
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
                </div>
                
                <div className='input-field'>
                    <p className='pLabel'>Slot</p>
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
                </div>
                
                <div className='input-field'>
                    <p className='pLabel'>Attunement</p>
                    <select name='attunement' onChange={handleChange}>
                        <option>Not Required</option>
                        <option>Required</option>
                    </select>
                </div>
                
                <div className='input-field'>
                    <p className='pLabel'>Description</p>
                    <textarea name='description' onChange={handleChange} required></textarea>
                </div>
                
                <p className='pLabel' style={{marginTop: 0}}>
                    ***Triple asterisks*** will make text bold <br/>
                    ---Three hyphens will start a new paragraph
                </p>
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