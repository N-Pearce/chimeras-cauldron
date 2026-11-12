import Supabase from '../Database/Supabase.js';
import {v4 as uuid} from 'uuid'
import supabase from '../Database/supabaseClient.js'

const {NotFoundError} = require("../Database/expressError.js");

/** Related functions for spells. */

class SpellDB {
  

  /** Find all spells that given user has access to. This should be all spells from spells_5e,
   * all homebrew spells created by the user, and all homebrew spells shared with the user
   *
   * if source = "homebrew"
   * Returns [{ user, share_link, name, rarity, type, slot, attunement, description }, ...]
   * else
   * Returns [{ index, name, rarity, type, slot, attunement, description }, ...]
   * 
   * Sorts all spells by spell name.
   * 
   * Returns sorted spells.
   * */

  static async findAll(name, user) {

    // Finds all spells shared to user with share_links
    const savedLinks = await supabase
      .from('shared_links')
      .select(`link_type,
              share_link`)
      .eq('user', user)

    let userLinksArr = []
    let spellLinksArr = []
    for (let link of savedLinks.data){
      if (link.link_type === "spell"){
        spellLinksArr.push(link.share_link)
      }
      if (link.link_type === "user"){
        userLinksArr.push(link.share_link)
      }
    }

    // turns array from ["a", "b"] to ("a", "b")
    let spellLinks = JSON.stringify(spellLinksArr).replace(/\[/g, '(').replace(/\]/g, ')');
    let userLinks = JSON.stringify(userLinksArr).replace(/\[/g, '(').replace(/\]/g, ')');

    // get all users from User Share Links, and self, to search for homebrew spells
    const linkedUsersAndSelf = await supabase
      .from('users')
      .select('username')
      .or(`share_link.in.${userLinks}, username.eq.${user}`)

    let usersArr = []
    for (let user of linkedUsersAndSelf.data){
      usersArr.push(user.username)
    }

    let usernames = JSON.stringify(usersArr).replace(/\[/g, '(').replace(/\]/g, ')');


    // All spells from spells_5e
    const result = await supabase
      .from("spells_5e")
      .select(`index,
                name,
                desc,
                higher_level,
                range,
                components,
                ritual,
                duration,
                concentration,
                casting_time,
                level, 
                classes, 
                school,
                source`)
      .ilike("name", `%${name}%`)
      .order("name", {ascending: true});

     /////////////////////////// return result.data;
    
    //All homebrew made by given user and from User Share Links,
    //and spells from spell Share Links
    const brew = await supabase
      .from('spells_homebrew')
      .select(`brew_id,
              name,
                desc,
                higher_level,
                range,
                components,
                ritual,
                duration,
                concentration,
                casting_time,
                level, 
                classes, 
                school,
                user,
                share_link,
                alternate_creator`)
      .or(`user.in.${usernames}, share_link.in.${spellLinks}`)
      .ilike('name', `%${name}%`)
      .order("name", {ascending: true})


    //Sort all returned spells in order by name
    let i=0,j=0,k=0;
    let arr1=result.data, arr2=brew.data
    let n1=result.data.length, n2=brew.data.length
    let arr3=Array(n1+n2).fill(0)
    
    while (i < n1 && j < n2) {
        if (arr1[i].name < arr2[j].name)
            arr3[k++] = arr1[i++];
        else
            arr3[k++] = arr2[j++];
    }

    while (i < n1)
        arr3[k++] = arr1[i++];

    while (j < n2)
        arr3[k++] = arr2[j++];

    const combinedData = arr3
    return combinedData
  }

    /** Given a 5e spell index or homebrew id, returns spell data
     *
     * Returns { name, (index or brew_id), rarity, type, slot, attunement, description, 
     *    (share_link, and user (if homebrew)) }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(index) {
    const homebrew = index > 0 ? true : false
    const source = homebrew ? "spells_homebrew" : "spells_5e"
    const primaryKey = homebrew ? "brew_id" : "index"


    // from source

    const result = await supabase
        .from(source) // source
        .select(`${homebrew ? "brew_id" : "index"},
                name,
                desc,
                higher_level,
                range,
                components,
                ritual,
                duration,
                concentration,
                casting_time,
                level, 
                classes, 
                school
                ${!homebrew ? ", source" : ""}
                ${homebrew ? ", share_link, user" : ''}`)
        .eq(primaryKey, index) //primaryKey, index

    if (result) return result.data[0]
    throw new NotFoundError(`No spell: ${index}`);
  }


}


export default SpellDB;
