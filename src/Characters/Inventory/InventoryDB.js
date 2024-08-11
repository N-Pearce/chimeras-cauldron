import supabase from '../../api-homebrew/supabaseClient.js'

const {NotFoundError} = require("../../api-homebrew/expressError");

/** Related functions for companies. */

class InventoryDB {

  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async add({index, brew_id}, characterId) {
    const result = await supabase
      .from("character_inventory")
      .insert({
          num_items: 1,
          item_5e_index: index,
          homebrew_item_id: brew_id,
          character_id: characterId
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

  static async getInventory(characterId) {

    const {data} = await supabase
        .from("character_inventory")
        .select(`id,
                num_items,
                items_5e 
                    (index,
                    name,
                    rarity,
                    slot,
                    type),
                homebrew_items
                    (brew_id,
                    user,
                    name,
                    rarity,
                    slot,
                    type)
                `)
        .eq("character_id", characterId)

    for (let i in data){
        let item = data[i]
        let flattenedItem = item;
        let source;
        if (item.items_5e){
            source = item.items_5e
        } else {
            source = item.homebrew_items
        }

        for (let key of Object.keys(source)){
            flattenedItem = {
                ...flattenedItem,
                [key]: source[key]
            }
        }
        delete flattenedItem.items_5e
        delete flattenedItem.homebrew_items
        data[i] = flattenedItem
    }
    
    data.sort((a, b) => a.name.localeCompare(b.name))

    return data
  }

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async getItem(id) {
    const {data} = await supabase.from("character_inventory")
        .select(`id,
                num_items,
                items_5e(name),
                homebrew_items(name)`)
        .eq("id", id)

    if (data[0].items_5e)
        data[0].name = data[0].items_5e.name
    if (data[0].homebrew_items)
        data[0].name = data[0].homebrew_items.name

    return data[0]
  }


  static async findItemFromDetails(characaterId, index){
    const foreignKey = index > 0 ? "homebrew_item_id" : "item_5e_index"

    const {data} = await supabase.from("character_inventory")
        .select(`id`)
        .eq("character_id", characaterId)
        .eq(foreignKey, index)

    return data[0].id
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

  static async update(id, num_items) {
    
    const result = await supabase
        .from("character_inventory")
        .update({
            num_items: num_items
        })
        .eq("id", id)
        .select()
    
    const inventoryItem = result.data[0];
    if (!inventoryItem) throw new NotFoundError(`No item found in Inventory: ${inventoryItem}`);

    return inventoryItem;
  }

//   /** Delete given company from database; returns undefined.
//    *
//    * Throws NotFoundError if company not found.
//    **/

  static async remove(id) {
    const result = await supabase
        .from("character_inventory")
        .delete()
        .eq("id", id)

    if (!result) throw new NotFoundError(`No item found in Inventory: ${id}`);
    return result
  }

  //// Equipped items functions

  // add item to equipped, removes item of same slot

  static async equipItem(inventoryId, slot, characterId){

    const {data} = await supabase.from("character_inventory")
        .select(`id,
                items_5e(slot),
                homebrew_items(slot)`)
        .eq("equipped", true)
        .eq("character_id", characterId)

    for (let item of data){
        if (item.items_5e?.slot === slot)
            await this.removeFromEquipped(item.id)
        if (item.homebrew_items?.slot === slot)
            await this.removeFromEquipped(item.id)
    }

    const result = await supabase.from("character_inventory")
        .update({
            equipped: true
        })
        .eq("id", inventoryId)
        .select()
        
    const inventoryItem = result.data[0];
    if (!inventoryItem) throw new NotFoundError(`No item found in Inventory: ${inventoryItem}`);

    return inventoryItem;
  }

  // get all equipped item

  static async getAllEquipped(characterId) {

    const {data} = await supabase
        .from("character_inventory")
        .select(`id,
                items_5e 
                    (index,
                    name,
                    rarity,
                    slot,
                    type,
                    attunement),
                homebrew_items
                    (brew_id,
                    name,
                    rarity,
                    slot,
                    type,
                    attunement)
                `)
        .eq("character_id", characterId)
        .eq("equipped", true)

    for (let i in data){
        let item = data[i]
        let flattenedItem = item;
        let source;
        if (item.items_5e){
            source = item.items_5e
        } else {
            source = item.homebrew_items
        }

        for (let key of Object.keys(source)){
            flattenedItem = {
                ...flattenedItem,
                [key]: source[key]
            }
        }
        delete flattenedItem.items_5e
        delete flattenedItem.homebrew_items
        data[i] = flattenedItem
    }
    // console.log(data)

    //////// 
    // can it differentiate between
    // homebrew and 5e after??
    ///////

    return data
  }

  // unequip item

  static async removeFromEquipped(id){
    const result = await supabase.from("character_inventory")
        .update({
            equipped: false
        })
        .eq("id", id)
        .select()

    const inventoryItem = result.data[0];
    if (!inventoryItem) throw new NotFoundError(`No item found in Inventory: ${inventoryItem}`);

    return inventoryItem;
  }
}


export default InventoryDB;
