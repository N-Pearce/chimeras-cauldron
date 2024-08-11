import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import Supabase from './api-homebrew/Supabase';

import SpellList from "./Spells/SpellList"
import SpellDetails from './Spells/SpellDetails';

import ItemList from './Items/ItemList'
import ItemDetails from './Items/ItemDetails';
import ShareLinkDetails from './Items/ShareLinkDetails';
import AddItem from './Items/AddItem';

import CharacterList from './Characters/CharacterList';
import CharacterDetails from './Characters/CharacterDetails';
import CharacterInventory from './Characters/Inventory/CharacterInventory';
import UpdateInventory from './Characters/Inventory/UpdateInventory'
import AddCharacter from './Characters/AddCharacter';

import Profile from './Profile/Profile'
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import Logout from './auth/Logout';
import Home from './Home'
import CopyrightNotice from './CopyrightNotice';
import NavBar from './NavBars/NavBar'
import UserContext from './auth/UserContext';

function App() {
  const [user, setUser] = useState(null)
  const [characterId, setCharacterId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function keepUser(){
      if (!user && localStorage.username && localStorage.passkey) {
        setLoading(true)
        let validated = await Supabase.validatePasskey(localStorage.username, localStorage.passkey)
        if (validated){
          setUser(localStorage.username)
        }
        setLoading(false)
      }}
      keepUser()
  }, [])

  async function login({username, password}){
    try {
      await Supabase.authenticate(username, password)
      let passkey = await Supabase.setHashedPasskey(username)
      localStorage.username = username
      localStorage.passkey = passkey
      setUser(username)
      return {success: true}
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }
  
  async function signup(signupData) {
    try {
      await Supabase.register(signupData);
      let passkey = await Supabase.setHashedPasskey(signupData.username)
      localStorage.username = signupData.username
      localStorage.passkey = passkey
      setUser(signupData.username)
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }
  
  function logout() {
    setUser(null)
    delete localStorage.username
    delete localStorage.passkey
  }

  if (loading) return <p>please wait...</p>

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser, characterId, setCharacterId}}>
          <BrowserRouter>
            <NavBar logout={logout}/>
            <Routes>
              <Route path='/spells' element={<SpellList/>}></Route>
              <Route path='/spells/:index' element={<SpellDetails/>}></Route>

              <Route path='/items' element={<ItemList/>}></Route>
              <Route path='/items/:index' element={<ItemDetails/>}></Route>
              <Route path='/share-link-info' element={<ShareLinkDetails/>}></Route>
              <Route path='/items/:source/add' element={<AddItem/>}></Route>

              <Route path='/characters' element={<CharacterList/>}></Route>
              <Route path='/characters/add' element={<AddCharacter/>}></Route>
              <Route path='/characters/:character' element={<CharacterDetails/>}></Route>
              <Route path='/characters/:character/inventory' element={<CharacterInventory/>}></Route>
              <Route path='/characters/:character/inventory/add' element={<ItemList isAdd={true}/>}></Route>
              <Route path='/characters/:character/inventory/equip' element={<CharacterInventory isEquip={true}/>}></Route>
              <Route path='/characters/:character/inventory/:id/update' element={<UpdateInventory/>}></Route>
              
              <Route path='/profile/:user' element={<Profile/>}></Route>
              <Route path='/login' element={<LoginForm login={login}/>}></Route>
              <Route path='/signup' element={<SignupForm signup={signup}/>}></Route>
              <Route path='/logout' element={<Logout logout={logout}/>}></Route>
              <Route path='/copyright-notice' element={<CopyrightNotice/>}></Route>
              <Route path='/' element={<Home/>}></Route>
              <Route path='*' element={<Navigate to="/"/>}></Route>
            </Routes>
          </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
