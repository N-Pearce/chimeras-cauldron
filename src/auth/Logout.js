import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom';

const Logout = ({logout}) => {
    const navigate = useNavigate()

    useEffect(() => {
      logout()
      navigate('/')
    }, [])

  return (
    <div>Logout</div>
  )
}

export default Logout