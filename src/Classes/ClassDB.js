import supabase from '../Database/supabaseClient.js'

const {NotFoundError} = require("../Database/expressError.js");


/** Related functions for characters. */

class ClassDB {
  /** Create a character (from name), update db, return new character.
   *
   * Returns { id, user_name, user }
   *
   * */



//   static async create({name, user_name}) {
//     const result = await supabase
//       .from("characters")
//       .insert({
//         user_name: user_name,
//         name: name
//       })
//       .select()

//     const character = result.data[0]

//     return character;
//   }




  /** Find all class features that match name to class_access
   *
   * Returns [{ id, level, name, desc, shorthand_action, shorthand_bonus_action, 
   * shorthand_reaction, shorthand_passive, shorthand_on_attack, num_uses }, ...]
   * */

  static async findAll({name}) {

    const result = await supabase.from("class_features")
                        .select(`id,
                                level,
                                name,
                                desc,
                                shorthand_action,
                                shorthand_bonus_action,
                                shorthand_reaction,
                                shorthand_passive,
                                shorthand_on_attack,
                                num_uses,
                                class_access`)
                        .eq("class_access", name.toLowerCase())

    const sortedData = result.data.sort((a, b) => a.level - b.level);
    const cmp = (a, b) => (a > b) - (a < b);
    result.data.sort(function(a, b) { 
        return cmp(a.level,b.level) || cmp(a.name,b.name)
    })

    return sortedData;
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


export default ClassDB;
