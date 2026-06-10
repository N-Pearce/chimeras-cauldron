import supabase from '../Database/supabaseClient.js'

const {NotFoundError} = require("../Database/expressError.js");


/** Related functions for characters. */

class CharacterDB {
  /** Create a character (from name), update db, return new character.
   *
   * Returns { id, user_name, user }
   *
   * */

  static async create({name, user_name}) {
    const result = await supabase
      .from("characters")
      .insert({
        user_name: user_name,
        name: name
      })
      .select()

    const character = result.data[0]

    return character;
  }

  /** Find all characters that match user_name
   *
   * Returns [{ id, name }, ...]
   * */

  static async findAll({user}) {

    const result = await supabase.from("characters")
                        .select(`id,
                                name`)
                        .eq("user_name", user)

    return result.data
  }

  /** Given a character_id, character name
   *
   * Returns { name }
   *
   * Throws NotFoundError if not found.
   **/

  static async getName(character_id) {

    const result = await supabase.from("characters")
                        .select(`name`)
                        .eq("id", character_id)
                        
    if (result) return result.data[0].name
    throw new NotFoundError(`No character: ${character_id}`);
  }

  /** 
   **/

  static async getClassFeatures(character_id) {

    const result = await supabase.from("character_class_features")
                        .select(`class_features
                                    (level,
                                    name,
                                    desc,
                                    shorthand_action,
                                    shorthand_bonus_action,
                                    shorthand_reaction,
                                    shorthand_passive,
                                    shorthand_on_attack,
                                    num_uses)`)
                        .eq("character_id", character_id)
                 
    let data = result.data
    for (let i in data){
      let item = data[i].class_features
      let flattenedItem = item;

      // Rename to shorthandBonusAction
      flattenedItem.shorthandBonusAction = flattenedItem.shorthand_bonus_action
        delete flattenedItem.bonus_action
      
      data[i] = flattenedItem
    }

    if (result) return data
    throw new NotFoundError(`No character: ${character_id}`);
  }

  static async addClassFeature(character_id, class_feature_id){
    const result1 = await supabase
      .from("character_class_features")
      .select("id")
      .eq("character_id", character_id)
      .eq("class_feature_id", class_feature_id)

    if (result1.data[0]) {
      return;
    }

    const result = await supabase
      .from("character_class_features")
      .insert({
        character_id: character_id,
        class_feature_id: class_feature_id
      })
      .select()

    const characterClassFeature = result.data[0]

    return characterClassFeature;
  }

  /** Update character data with `data`.
   *
   * Throws NotFoundError if not found.
   */

  static async update() {  
    // unneeded for current project
  }

  /** Delete given character from database; returns result.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove() {
    // unneeded for current project
  }
}


export default CharacterDB;
