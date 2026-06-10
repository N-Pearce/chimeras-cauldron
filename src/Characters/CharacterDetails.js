import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import UserContext from '../auth/UserContext';
import Supabase from '../Database/Supabase';
import EquippedCard from './Inventory/EquippedCard';
import {v4 as uuid} from 'uuid'

const CharacterDetails = () => {
  const navigate = useNavigate()
  const {character} = useParams();
  const {user, characterId} = useContext(UserContext)
  const [done, setDone] = useState(false)
  const [rerender, setRerender] = useState(false)
  const [equippedGear, setEquippedGear] = useState(false)
  const [classFeatures, setClassFeatures] = useState(false)


  async function search(){
    let data = await Supabase.getInventory(characterId)
    // let data2 = await Supabase.getAllEquipped(characterId)
    const equippedGear = data.filter(item => item.equipped == true);
    setEquippedGear(equippedGear);
    let classData = await Supabase.getCharacterClassFeatures(characterId)
    // console.log(classData)
    setClassFeatures(classData)
    setDone(true)

}

  useEffect(() => {
    setDone(false)
    if (!user) navigate('/')
    else search()
  }, [rerender, user])


  if (!done) return <p className='white'>Loading...</p>

  // console.log(equippedGear)

  return (
    <>
      <h1 className='white'>{character}</h1>

        
      <div style={{display: "flex"}}>
          <Link to={`/characters/${character}/inventory`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
              <p>Select Gear</p>
          </Link>
          <Link to={`/characters/${character}/inventory/add`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
              <p>Select Spells</p>
          </Link>
          <Link to={`/classes/`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
              <p>Add Class Features</p>
          </Link>
        </div>

        {/* <div style={{display: "flex"}}>
          <Link to={`/characters/${character}/inventory`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
              <p>Inventory</p>
          </Link>
          <Link to={`/characters/${character}/inventory/add`} className={'card itemCard'} style={{flex: "1", margin: "3%"}} >
              <p>Add to Inventory</p>
          </Link>
        </div> */}



        
        
          {/* Actions */}
        <h4 className='white' style={{textAlign: 'left', paddingLeft: '3%'}}>
          Actions: 
        </h4>

        <div className='itemCard'>
          <p><b>Attack:</b> Attack with a weapon or an Unarmed Strike</p>
          <p><b>Dash:</b> For the rest of the turn, give yourself extra movement equal to your Speed.</p>
          <p><b>Disengage:</b> Your movement doesn't provoke Opportunity Attacks for the rest of the turn.</p>
          <p><b>Dodge:</b> Until the start of your next turn, attack rolls against you have Disadvantage, and  you make Dexterity saving throws with Advantage. You lose this benefit if you have the Incapacitated condition or if your  Speed is 0.</p>
          <p><b>Help:</b> Help another creature’s ability check or attack roll, or administer first aid.</p>
          <p><b>Hide:</b> Make a Dexterity (Stealth) check.</p>
          <p><b>Influence:</b> Make a Charisma (Deception, Intimidation, Performance, or Persuasion) or Wisdom (Animal Handling) check to alter a creature’s attitude.</p>
          <p><b>Magic:</b> Cast a spell, use a magic item, or use a magical feature.</p>
          <p><b>Ready:</b> Prepare to take an action in response to a trigger you define.</p>
          <p><b>Search:</b> Make a Wisdom (Insight, Medicine, Perception, or Survival) check.</p>
          <p><b>Study:</b> Make an Intelligence (Arcana, History, Investigation, Nature, or Religion) check. </p>
          <p><b>Utilize:</b> Use a nonmagical object.</p>
            
            {Object.keys(classFeatures).map(key => (
            classFeatures[key].shorthand_action ?
            
                
            <p key={key}>
              <b>{classFeatures[key].name}:</b> {classFeatures[key].shorthand_action}
            </p>
            :""
          ))}
          {Object.keys(equippedGear).map(key => (
            equippedGear[key].action ?
                
            <p key={key}>
              <b>{equippedGear[key].name}:</b> {equippedGear[key].action}
            </p>
            :""
          ))}
        </div>

          {/* Bonus Actions */}
        <h4 className='white' style={{textAlign: 'left', paddingLeft: '3%'}}>
          Bonus Actions: 
        </h4>

        <div className='itemCard'>
          {Object.keys(classFeatures).map(key => (
            classFeatures[key].shorthandBonusAction ?
            
                
            <p key={key}>
              <b>{classFeatures[key].name}:</b> {classFeatures[key].shorthandBonusAction}
            </p>
            :""
          ))}
          {Object.keys(equippedGear).map(key => (
            equippedGear[key].bonusAction ?
                
            <p key={key}>
              <b>{equippedGear[key].name}:</b> {equippedGear[key].bonusAction}
            </p>
            :""
          ))}
        </div>

          {/* Reactions */}
        <h4 className='white' style={{textAlign: 'left', paddingLeft: '3%'}}>
          Reactions: 
        </h4>

        <div className='itemCard'>
          {Object.keys(classFeatures).map(key => (
            classFeatures[key].shorthand_reaction ?
            
                
            <p key={key}>
              <b>{classFeatures[key].name}:</b> {classFeatures[key].shorthand_reaction}
            </p>
            :""
          ))}
          {Object.keys(equippedGear).map(key => (
            equippedGear[key].reaction ?
                
            <p key={key}>
              <b>{equippedGear[key].name}:</b> {equippedGear[key].reaction}
            </p>
            :""
          ))}
        </div>

          {/* Passives */}
        <h4 className='white' style={{textAlign: 'left', paddingLeft: '3%'}}>
          Passive Effects: 
        </h4>

          <div className='itemCard'>
            {Object.keys(classFeatures).map(key => (
            classFeatures[key].shorthand_passive ?
            
                
            <p key={key}>
              <b>{classFeatures[key].name}:</b> {classFeatures[key].shorthand_passive}
            </p>
            :""
          ))}
            {Object.keys(equippedGear).map(key => (
              equippedGear[key].passive ? 

              <p key={equippedGear[key].id}>
                {equippedGear[key].passive
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").split("\n")
                .map(paragraph => (
                    <span><b>{equippedGear[key].name}:</b> {paragraph}</span>
                  ))}
              </p>
              :""
            ))}
          </div>
{/*         
        /** <EquippedCard
             key={uuid()}
             item={gearAndSpells[key]}
             slot={key}
             rerender={rerender}
             setRerender={setRerender}
           />*/ }
    </>
  )
}

export default CharacterDetails