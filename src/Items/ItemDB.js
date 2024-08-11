import Supabase from '../api-homebrew/Supabase';
import {v4 as uuid} from 'uuid'
import supabase from '../api-homebrew/supabaseClient.js'

const {NotFoundError} = require("../api-homebrew/expressError");

/** Related functions for companies. */

class ItemDB {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({name, rarity, type, slot, attunement, description}, source, user) {
    const homebrew = source === "homebrew" ? true : false
    const table = homebrew ? "homebrew_items" : "items_5e"
    const index = name.toLowerCase().trim().replace(/\s+/g,'-');
    const shareLink = uuid()

    const result = await supabase
      .from(table)
      .insert({
        ...(!homebrew ? {index : index} : {}),
        ...(homebrew ? {user : user} : {}),
        ...(homebrew ? {share_link : shareLink} : {}),
        name: name,
        rarity: rarity,
        type: type,
        slot: slot,
        attunement: attunement,
        description: description,
      })
      .select()

    const item = result.data[0]

    return item;
  }

//   /** Find all companies (optional filter on searchFilters).
//    *
//    * searchFilters (all optional):
//    * - minEmployees
//    * - maxEmployees
//    * - name (will find case-insensitive, partial matches)
//    *
//    * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
//    * */

  static async findAll(name, user) {

    // Prep for homebrew table with shared links

    const savedLinks = await supabase
      .from('shared_links')
      .select(`link_type,
              share_link`)
      .eq('user', user)

    let userLinksArr = []
    let itemLinksArr = []
    for (let link of savedLinks.data){
      if (link.link_type === "item"){
        itemLinksArr.push(link.share_link)
      }
      if (link.link_type === "user"){
        userLinksArr.push(link.share_link)
      }
    }

    // turns array from ["a", "b"] to ("a", "b")
    let itemLinks = JSON.stringify(itemLinksArr).replace(/\[/g, '(').replace(/\]/g, ')');
    let userLinks = JSON.stringify(userLinksArr).replace(/\[/g, '(').replace(/\]/g, ')');

    const linkedUsersAndSelf = await supabase
      .from('users')
      .select('username')
      .or(`share_link.in.${userLinks}, username.eq.${user}`)

    let usersArr = []
    for (let user of linkedUsersAndSelf.data){
      usersArr.push(user.username)
    }

    let usernames = JSON.stringify(usersArr).replace(/\[/g, '(').replace(/\]/g, ')');

    // Call to the Item Tables
    const result = await supabase
      .from("items_5e")
      .select(`index,
              name,
              rarity,
              type,
              slot,
              attunement,
              description`)
      .ilike("name", `%${name}%`)
      .order("name", {ascending: true});
    
    const brew = await supabase
      .from('homebrew_items')
      .select(`brew_id,
              user,
              name,
              rarity,
              type,
              slot,
              attunement,
              description`)
      .or(`user.in.${usernames}, share_link.in.${itemLinks}`)
      .ilike('name', `%${name}%`)
      .order("name", {ascending: true})

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

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(index) {
    const homebrew = index > 0 ? true : false
    const source = homebrew ? "homebrew_items" : "items_5e"
    const primaryKey = homebrew ? "brew_id" : "index"

    const result = await supabase.from(source)
        .select(`name, 
                ${homebrew ? "brew_id" : "index"},
                rarity,
                type,
                slot,
                attunement,
                description
                ${homebrew ? ", share_link, user" : ''}`)
        .eq(primaryKey, index)

    if (result) return result.data[0]
    throw new NotFoundError(`No item: ${index}`);
  }

//   /** Update company data with `data`.
//    *
//    * This is a "partial update" --- it's fine if data doesn't contain all the
//    * fields; this only changes provided ones.
//    *
//    * Data can include: {name, description, numEmployees, logoUrl}
//    *
//    * Returns {handle, name, description, numEmployees, logoUrl}
//    *
//    * Throws NotFoundError if not found.
//    */

  static async update(handle, data) {  
    // unneeded for current project
  }

//   /** Delete given company from database; returns undefined.
//    *
//    * Throws NotFoundError if company not found.
//    **/

  static async remove(handle) {
    // unneeded for current project
  }

  /*
    Share Links
  */

  static async getSharedUsers(share_link, user){
    const {share_link:userShareLink} = await Supabase.getUser(user)

    const result = await supabase
      .from(`shared_links`)
      .select(`user,
        link_type`)
      .or(`share_link.eq.${share_link}, share_link.eq.${userShareLink}`)

    return result.data
  }

  static async removeSharedUser(share_link, link_type, user, userToRemove){
    const {share_link:userShareLink} = await Supabase.getUser(user)

    const removedUser = await supabase
      .from(`shared_links`)
      .delete()
      .eq('share_link', link_type === "item" ? share_link : userShareLink)
      .eq("user", userToRemove)
      .select()

    const {data: [{brew_id}]} = await supabase
      .from('homebrew_items')
      .select('brew_id')
      .eq("share_link", share_link)
    const newLink = uuid()

    if (link_type === "item"){
      await supabase
        .from("homebrew_items")
        .update({
          share_link: newLink
        })
        .eq("brew_id", brew_id)
        .select()
    } else {
      await supabase
        .from("users")
        .update({
          share_link: newLink
        })
        .eq("username", user)
        .select()
    }

    const newUserLinks = await supabase
      .from("shared_links")
      .update({
        share_link: newLink
      })
      .eq("share_link", link_type === "item" ? share_link : userShareLink)
      .select()
  }
}


export default ItemDB;
