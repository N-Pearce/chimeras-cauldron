import Supabase from '../Database/Supabase.js';
import {v4 as uuid} from 'uuid'
import supabase from '../Database/supabaseClient.js'

const {NotFoundError} = require("../Database/expressError.js");

/** Related functions for items. */

class MtgCardDB {
  /** Create a item (from data, source, and user), update db, return new item data.
   *
   * data should be { name, rarity, type, slot, attunement, description }
   *
   * if source = "homebrew"
   * Returns { user, share_link, name, rarity, type, slot, attunement, description }
   * else
   * Returns { index, name, rarity, type, slot, attunement, description }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({title, jpg}, user) {
    const index = title.toLowerCase().trim().replace(/\s+/g,'-');
    
    const result = await supabase
    //   .from(table)
      .insert({
        title: title,
        jpg: jpg,
      })
      .select()

    const mtgCard = result.data[0]

    return mtgCard;
  }

  /** Find all items that given user has access to. This should be all items from items_5e,
   * all homebrew items created by the user, and all homebrew items shared with the user
   *
   * if source = "homebrew"
   * Returns [{ user, share_link, name, rarity, type, slot, attunement, description }, ...]
   * else
   * Returns [{ index, name, rarity, type, slot, attunement, description }, ...]
   * 
   * Sorts all items by item name.
   * 
   * Returns sorted items.
   * */

 static async findAll() {
    console.log(9)

    const result = await supabase.from("mtg_cards")
                        .select(`id,
                            title,
                            colors`)


    console.log(result)
    return result.data
  }

  /** Given a 5e item index or homebrew id, returns item data
   *
   * Returns { name, (index or brew_id), rarity, type, slot, attunement, description, 
   *    (share_link, and user (if homebrew)) }
   *
   * Throws NotFoundError if not found.
   **/

//   static async get(index) {

//     const result = await supabase.from(source)
//         .select(`title, 
//                 jpg`)
//         .eq(primaryKey, index)

//     if (result) return result.data[0]
//     throw new NotFoundError(`No item: ${index}`);
//   }



  static async update(handle, data) {  
    // not implemented. May be in future updates
  }

  static async remove(handle) {
    // not implemented. May be in future updates
  }


}


export default MtgCardDB;
