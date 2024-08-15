import supabase from '../../api-homebrew/supabaseClient.js'

const {NotFoundError} = require("../../api-homebrew/expressError");

/** Related functions for Inventory Items */

class InventoryDB {

  /** Create a new "in inventory" instance item
   *
   * data should be { index or brew_id (not both), characterId }
   *
   * Returns { num_items, item_5e_index, homebrew_item_id, character_id },
   * where either item_5e_index or homebrew_item_id should be null
   *
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

  /** Find all "in inventory" instance items that matches given characterId
   *
   * Returns [{ id, num_items, index or brew_id (not both), name, rarity, slot, type }, ...]
   * sorted alphabetically by name. 
   * 
   * All data besides id and num_items is from the items_5e table or homebrew_items table, 
   * and flattened to have all data easily accesible in the object
   * */

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

  /** Given an inventory id, return minimal about inventory item
   *
   * Returns { id, num_items, name } where name can be from items_5e or homebrew_items, 
   * but is flattened down for easy access within the object.
   *
   * Throws NotFoundError if not found.
   **/

  static async getItem(id) {
    const {data} = await supabase
        .from("character_inventory")
        .select(`id,
                num_items,
                items_5e(name),
                homebrew_items(name)`)
        .eq("id", id)

    if (!data[0]) throw new NotFoundError(`No inventory id: ${id}`);

    if (data[0].items_5e)
        data[0].name = data[0].items_5e.name
    if (data[0].homebrew_items)
        data[0].name = data[0].homebrew_items.name

    return data[0]
  }

  /**
   * While in details page when looking changing equipped items, itemDetails has 
   * item index of brew_id.
   * 
   * If equipped from that page, search for items in inventory with matching foreign key
   * and equips it.
   * 
   * If multiple instances are found, the items are duplicate instances of the same item,
   * so ignoring all but the first causes no issues.
   */

  static async findItemFromDetails(characaterId, index){
    const foreignKey = index > 0 ? "homebrew_item_id" : "item_5e_index"

    const {data} = await supabase
        .from("character_inventory")
        .select(`id`)
        .eq("character_id", characaterId)
        .eq(foreignKey, index)

        console.log(data)

    return data[0].id
  }

  /** Update inventory item data with `num_items`.
   * 
   * num_items will always be the previous num_items + or - an amount
   *
   * Returns {id, character_id, equipped, homebrew_item_id or item_5e_index (not both), num_items}
   *
   * Throws NotFoundError if not found.
   */

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

  /** Delete given inventory item from database; returns result.
   *
   * Throws NotFoundError if inventory item not found.
   **/

  static async remove(id) {
    const result = await supabase
        .from("character_inventory")
        .delete()
        .eq("id", id)

    if (!result) throw new NotFoundError(`No item found in Inventory: ${id}`);
    return result
  }

  //// Equipped items functions

  /**
   * Set equipped of all items of given slot to false, 
   * set equipped of given inventoryId to true
   * 
   * Returns NotFoundError if inventory item not found
   */

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

  /**Find all "in inventory" instance items that matches given characterId, 
   * and where equipped is true
   *
   * Returns [{ id, num_items, index or brew_id (not both), name, rarity, slot, type }, ...]
   * sorted alphabetically by name. 
   * 
   * All data besides id and num_items is from the items_5e table or homebrew_items table, 
   * and flattened to have all data easily accesible in the object
   */

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

    return data
  }

  /**
   * Sets equipped to false for given inventoryId (as `id`)
   * 
   * Returns NotFoundError if inventory item not found
   */

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
