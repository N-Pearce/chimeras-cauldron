import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserContext from './auth/UserContext'

const Home = () => {
  const {user} = useContext(UserContext)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(true)
  }, []) 

  if (!done) return ""

  return (
    <div>
        <h1 className='white'>Welcome to Chimera's Cauldron!</h1>
        <h3 className='white'>Welcome{user ? ` ${user}` : ''}!</h3>
        
        {!user ? 
        <div>
          <Link to='/login'>
            <button className='add-btn' style={{marginRight: '3%'}}>
              Login
            </button>
          </Link>
          <Link to='/signup'>
            <button className='add-btn'>
              Signup
            </button>
          </Link>
          <br></br>
          <br></br>
        </div>
        :""}

        <Link to='/copyright-notice'>
          <button className='add-btn'>
            Copyright Notice
          </button>
        </Link>
    </div>
  )
}

export default Home